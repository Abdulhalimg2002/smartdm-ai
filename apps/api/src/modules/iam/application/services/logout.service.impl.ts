import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  LOGOUT_SERVICE,
  type ILogoutService,
} from './logout.service.js';

import {
  SESSION_REPOSITORY,
  type ISessionRepository,
} from '../../domain/repositories/session.repository.js';

import {
  SESSION_TOKEN_SERVICE,
  type ISessionTokenService,
} from './session-token.service.js';

import {
  InvalidSessionError,
} from '../errors/invalid-session.error.js';

@Injectable()
export class LogoutService
  implements ILogoutService
{
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,

    @Inject(SESSION_TOKEN_SERVICE)
    private readonly sessionTokenService: ISessionTokenService,
  ) {}

  async logout(
    token: string,
  ): Promise<void> {
    const tokenHash =
      this.sessionTokenService.hash(token);

    const session =
      await this.sessionRepository.findByTokenHash(
        tokenHash,
      );

    if (!session) {
      throw new InvalidSessionError();
    }

    if (!session.isValid()) {
      throw new InvalidSessionError();
    }

    session.revoke();

    await this.sessionRepository.update(
      session,
    );
  }
}