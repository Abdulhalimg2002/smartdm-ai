
import { Temporal } from '@js-temporal/polyfill';

import { db } from '../../../../../prisma/db.js';

import {
  UserCredential,
} from '../../../domain/entities/user-credential.entity.js';

import {
  IUserCredentialRepository,
} from '../../../domain/repositories/user-credential.repository.js';

const varchar = <N extends number>(value: string) =>
  value as string & {
    readonly __varcharLength: N;
  };

const toTemporalInstant = (
  value: Date | null,
): Temporal.Instant | null => {
  if (!value) {
    return null;
  }

  return Temporal.Instant.fromEpochMilliseconds(
    value.getTime(),
  );
};

const toDate = (
  value: Temporal.Instant | null,
): Date | null => {
  if (!value) {
    return null;
  }

  return new Date(
    Number(value.epochMilliseconds),
  );
};

export class PrismaUserCredentialRepository
  implements IUserCredentialRepository
{
  async findByUserId(
    userId: string,
  ): Promise<UserCredential | null> {
    const record = await db.orm.public.UserCredential
      .where({ userId })
      .first();

    if (!record) {
      return null;
    }

    return UserCredential.create({
      id: record.id,
      userId: record.userId,
      passwordHash: record.passwordHash,
      passwordChangedAt: toDate(
        record.passwordChangedAt,
      ),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async create(
    credentials: UserCredential,
  ): Promise<UserCredential> {
    const record = await db.orm.public.UserCredential.create({
      id: credentials.id,
      userId: credentials.userId,
      passwordHash: varchar<255>(
        credentials.passwordHash,
      ),
      passwordChangedAt: toTemporalInstant(
        credentials.passwordChangedAt,
      ),
    });

    return UserCredential.create({
      id: record.id,
      userId: record.userId,
      passwordHash: record.passwordHash,
      passwordChangedAt: toDate(
        record.passwordChangedAt,
      ),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async update(
    credentials: UserCredential,
  ): Promise<UserCredential> {
    const record = await db.orm.public.UserCredential
      .where({ userId: credentials.userId })
      .update({
        passwordHash: varchar<255>(
          credentials.passwordHash,
        ),
        passwordChangedAt: toTemporalInstant(
          credentials.passwordChangedAt,
        ),
      });

    if (!record) {
      throw new Error(
        `User credentials not found for user: ${credentials.userId}`,
      );
    }

    return UserCredential.create({
      id: record.id,
      userId: record.userId,
      passwordHash: record.passwordHash,
      passwordChangedAt: toDate(
        record.passwordChangedAt,
      ),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

