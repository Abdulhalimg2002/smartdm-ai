import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  REVOKE_SESSION_SERVICE,
  type IRevokeSessionService,
} from './revoke-session.service.js';

import {
  SESSION_REPOSITORY,
  type ISessionRepository,
} from '../../domain/repositories/session.repository.js';

import {
  InvalidSessionError,
} from '../errors/invalid-session.error.js';

@Injectable()
export class RevokeSessionService
  implements IRevokeSessionService
{
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async revokeSession(
    sessionId: string,
    userId: string,
  ): Promise<void> {
    const session =
      await this.sessionRepository.findById(
        sessionId,
      );

    if (!session) {
      throw new InvalidSessionError();
    }

    if (session.userId !== userId) {
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