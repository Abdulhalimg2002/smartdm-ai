import { Temporal } from '@js-temporal/polyfill';

import { AuthEventType } from '../../../domain/entities/auth-event-type.entity.js';

import {
  IAuthEventTypeRepository,
} from '../../../domain/repositories/auth-event-type.repository.js';

import { db } from '../../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

export class PrismaAuthEventTypeRepository
  implements IAuthEventTypeRepository
{
  async findByCode(
    code: string,
  ): Promise<AuthEventType | null> {
    const record =
      await db.orm.public.AuthEventType
        .where({
          code: varchar<50>(code),
        })
        .first();

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  private toDomain(
    record: {
      id: string;
      code: string;
      name: string;
      description: string | null;
      isActive: boolean;
      sortOrder: number;
      createdAt: Temporal.Instant;
      updatedAt: Temporal.Instant;
    },
  ): AuthEventType {
    return AuthEventType.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      isActive: record.isActive,
      sortOrder: record.sortOrder,
      createdAt: new Date(
        Number(
          record.createdAt.epochMilliseconds,
        ),
      ),
      updatedAt: new Date(
        Number(
          record.updatedAt.epochMilliseconds,
        ),
      ),
    });
  }
}