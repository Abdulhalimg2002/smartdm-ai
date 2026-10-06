import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { createHash } from 'node:crypto';

import {
  PASSWORD_RESET_REPOSITORY,
  type IPasswordResetRepository,
} from '../../domain/repositories/password-reset.repository.js';

import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../domain/repositories/user-credential.repository.js';

import {
  SESSION_REPOSITORY,
  type ISessionRepository,
} from '../../domain/repositories/session.repository.js';

import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from './password-hasher.service.js';

import {
  type IResetPasswordService,
} from './reset-password.service.js';

import {
  InvalidPasswordResetError,
} from '../errors/invalid-password-reset.error.js';

import {
  AUTH_EVENT_SERVICE,
  type IAuthEventService,
} from './auth-event.service.js';

@Injectable()
export class ResetPasswordService
  implements IResetPasswordService
{
  constructor(
    @Inject(PASSWORD_RESET_REPOSITORY)
    private readonly passwordResetRepository:
      IPasswordResetRepository,

    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly credentialRepository:
      IUserCredentialRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher:
      IPasswordHasher,

    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository:
      ISessionRepository,

    @Inject(AUTH_EVENT_SERVICE)
    private readonly authEventService:
      IAuthEventService,
  ) {}

  async resetPassword(params: {
    token: string;
    newPassword: string;
    ipAddress?: string | null;
  userAgent?: string | null;
  }): Promise<void> {
    const tokenHash =
      createHash('sha256')
        .update(params.token)
        .digest('hex');

    const passwordReset =
      await this.passwordResetRepository
        .findByTokenHash(tokenHash);

    if (
      !passwordReset ||
      !passwordReset.isValid()
    ) {
      throw new InvalidPasswordResetError();
    }

    const credentials =
      await this.credentialRepository
        .findByUserId(
          passwordReset.userId,
        );

    if (!credentials) {
      throw new InvalidPasswordResetError();
    }

    const passwordHash =
      await this.passwordHasher.hash(
        params.newPassword,
      );

    credentials.changePassword(
      passwordHash,
    );

    await this.credentialRepository.update(
      credentials,
    );

    passwordReset.use();

    await this.passwordResetRepository.update(
      passwordReset,
    );

    await this.sessionRepository.revokeAllByUserId(
      passwordReset.userId,
    );

   await this.authEventService.record({
  userId: passwordReset.userId,
  type: 'PASSWORD_RESET_COMPLETED',
  ipAddress: params.ipAddress,
  userAgent: params.userAgent,
});
  }
}

