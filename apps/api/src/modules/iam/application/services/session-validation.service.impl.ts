import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  SESSION_REPOSITORY,
  type ISessionRepository,
} from '../../domain/repositories/session.repository.js';

import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../domain/repositories/user.repository.js';

import {
  SESSION_TOKEN_SERVICE,
  type ISessionTokenService,
} from './session-token.service.js';

import type {
  ISessionValidationService,
} from './session-validation.service.js';

import {
  Session,
} from '../../domain/entities/session.entity.js';

import {
  User,
} from '../../domain/entities/user.entity.js';

import {
  InvalidSessionError,
} from '../errors/invalid-session.error.js';

@Injectable()
export class SessionValidationService
  implements ISessionValidationService
{
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(SESSION_TOKEN_SERVICE)
    private readonly sessionTokenService: ISessionTokenService,
  ) {}

  async validate(
    token: string,
  ): Promise<{
    session: Session;
    user: User;
  }> {
    const tokenHash =
      this.sessionTokenService.hash(
        token,
      );

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

    const user =
      await this.userRepository.findById(
        session.userId,
      );

    if (!user) {
      throw new InvalidSessionError();
    }

    return {
      session,
      user,
    };
  }
}