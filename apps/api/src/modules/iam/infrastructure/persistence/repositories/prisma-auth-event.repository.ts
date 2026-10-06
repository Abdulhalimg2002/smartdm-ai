import { Temporal } from '@js-temporal/polyfill';

import { AuthEvent } from '../../../domain/entities/auth-event.entity.js';
import {
  IAuthEventRepository,
} from '../../../domain/repositories/auth-event.repository.js';
import { db } from '../../../../../prisma/db.js';
type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(
  value: string,
) => value as Varchar<N>;
export class PrismaAuthEventRepository
  implements IAuthEventRepository
{
  async findById(
    id: string,
  ): Promise<AuthEvent | null> {
    const record =
      await db.orm.public.AuthEvent
        .where({ id })
        .first();

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

 async create(
  authEvent: AuthEvent,
): Promise<AuthEvent> {
  const record =
    await db.orm.public.AuthEvent.create({
      id: authEvent.id,
      userId: authEvent.userId,
      authEventTypeId:
        authEvent.authEventTypeId,
      occurredAt:
        Temporal.Instant.fromEpochMilliseconds(
          authEvent.occurredAt.getTime(),
        ),
      ipAddress: authEvent.ipAddress
        ? varchar<45>(authEvent.ipAddress)
        : null,
      userAgent: authEvent.userAgent,
    });

  return this.toDomain(record);
}

  async findByUserId(
    userId: string,
  ): Promise<AuthEvent[]> {
    const records =
      await db.orm.public.AuthEvent
        .where({ userId })
        .all();

    return records.map(
      (record) => this.toDomain(record),
    );
  }

  private toDomain(
    record: {
      id: string;
      userId: string | null;
      authEventTypeId: string;
      occurredAt: Temporal.Instant;
      ipAddress: string | null;
      userAgent: string | null;
      createdAt: Temporal.Instant;
      updatedAt: Temporal.Instant;
    },
  ): AuthEvent {
    return AuthEvent.create({
      id: record.id,
      userId: record.userId,
      authEventTypeId:
        record.authEventTypeId,
      occurredAt:
        new Date(
          Number(
            record.occurredAt.epochMilliseconds,
          ),
        ),
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
      createdAt:
        new Date(
          Number(
            record.createdAt.epochMilliseconds,
          ),
        ),
      updatedAt:
        new Date(
          Number(
            record.updatedAt.epochMilliseconds,
          ),
        ),
    });
  }
}