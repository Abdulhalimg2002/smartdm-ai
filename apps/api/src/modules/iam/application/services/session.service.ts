import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import {
  SESSION_REPOSITORY,
  type ISessionRepository,
} from '../../domain/repositories/session.repository.js';

import {
  SESSION_TOKEN_SERVICE,
  type ISessionTokenService,
} from './session-token.service.js';

import {
  Session,
} from '../../domain/entities/session.entity.js';

export const SESSION_SERVICE = Symbol(
  'SESSION_SERVICE',
);

export interface ISessionService {
  create(params: {
    userId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<{
    session: Session;
    token: string;
  }>;
}

@Injectable()
export class SessionService
  implements ISessionService
{
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository:
      ISessionRepository,

    @Inject(SESSION_TOKEN_SERVICE)
    private readonly sessionTokenService:
      ISessionTokenService,
  ) {}

  async create(params: {
    userId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<{
    session: Session;
    token: string;
  }> {
    const rawToken =
      this.sessionTokenService.generate();

    const tokenHash =
      this.sessionTokenService.hash(
        rawToken,
      );

    const expiresAt =
      new Date(
        Date.now() +
          30 * 24 * 60 * 60 * 1000,
      );

    const session =
      Session.createNew({
        id: randomUUID(),
        userId: params.userId,
        tokenHash,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        expiresAt,
      });

    const createdSession =
      await this.sessionRepository.create(
        session,
      );

    return {
      session: createdSession,
      token: rawToken,
    };
  }
}