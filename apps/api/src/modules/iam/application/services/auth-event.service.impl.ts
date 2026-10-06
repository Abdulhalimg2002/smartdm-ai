import { randomUUID } from 'node:crypto';

import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { AuthEvent } from '../../domain/entities/auth-event.entity.js';

import {
  AUTH_EVENT_REPOSITORY,
  type IAuthEventRepository,
} from '../../domain/repositories/auth-event.repository.js';

import {
  AUTH_EVENT_TYPE_REPOSITORY,
  type IAuthEventTypeRepository,
} from '../../domain/repositories/auth-event-type.repository.js';

import {
  IAuthEventService,
} from './auth-event.service.js';

@Injectable()
export class AuthEventService
  implements IAuthEventService
{
  constructor(
    @Inject(AUTH_EVENT_REPOSITORY)
    private readonly authEventRepository:
      IAuthEventRepository,

    @Inject(AUTH_EVENT_TYPE_REPOSITORY)
    private readonly authEventTypeRepository:
      IAuthEventTypeRepository,
  ) {}

  async record(params: {
    userId?: string | null;
    type: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<AuthEvent> {
    const authEventType =
      await this.authEventTypeRepository.findByCode(
        params.type,
      );

    if (!authEventType) {
      throw new Error(
        `Auth event type not found: ${params.type}`,
      );
    }

    const authEvent =
      AuthEvent.createNew({
        id: randomUUID(),
        userId: params.userId,
        authEventTypeId:
          authEventType.id,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });

    return this.authEventRepository.create(
      authEvent,
    );
  }
}