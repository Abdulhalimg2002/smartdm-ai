import { Temporal } from '@js-temporal/polyfill';

import { db } from '../../../../../prisma/db.js';

import {
  PasswordReset,
} from '../../../domain/entities/password-reset.entity.js';

import type {
  IPasswordResetRepository,
} from '../../../domain/repositories/password-reset.repository.js';

const varchar = <N extends number>(value: string) =>
  value as string & {
    readonly __varcharLength: N;
  };

const toTemporalInstant = (
  value: Date | null,
): Temporal.Instant | null => {
  if (!value) return null;

  return Temporal.Instant.fromEpochMilliseconds(
    value.getTime(),
  );
};

const toDate = (
  value: Temporal.Instant | null,
): Date | null => {
  if (!value) return null;

  return new Date(
    Number(value.epochMilliseconds),
  );
};

const toEntity = (record: any): PasswordReset => {
  return PasswordReset.create({
    id: record.id,
    userId: record.userId,
    tokenHash: record.tokenHash,
    expiresAt: toDate(record.expiresAt)!,
    usedAt: toDate(record.usedAt),
    revokedAt: toDate(record.revokedAt),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
};

export class PrismaPasswordResetRepository
  implements IPasswordResetRepository
{
  async findById(
    id: string,
  ): Promise<PasswordReset | null> {
    const record =
      await db.orm.public.PasswordReset
        .where({ id })
        .first();

    if (!record) {
      return null;
    }

    return toEntity(record);
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<PasswordReset | null> {
    const record =
      await db.orm.public.PasswordReset
        .where({
          tokenHash: varchar<255>(tokenHash),
        })
        .first();

    if (!record) {
      return null;
    }

    return toEntity(record);
  }

  async findActiveByUserId(
    userId: string,
  ): Promise<PasswordReset | null> {
    const records =
      await db.orm.public.PasswordReset
        .where({ userId })
        .all();

    const activeRecord = records.find(
      (record) => {
        const reset = toEntity(record);

        return reset.isValid();
      },
    );

    if (!activeRecord) {
      return null;
    }

    return toEntity(activeRecord);
  }

  async create(
    passwordReset: PasswordReset,
  ): Promise<PasswordReset> {
    const record =
      await db.orm.public.PasswordReset.create({
        id: passwordReset.id,
        userId: passwordReset.userId,
        tokenHash: varchar<255>(
          passwordReset.tokenHash,
        ),
        expiresAt:
          toTemporalInstant(
            passwordReset.expiresAt,
          )!,
        usedAt:
          toTemporalInstant(
            passwordReset.usedAt,
          ),
        revokedAt:
          toTemporalInstant(
            passwordReset.revokedAt,
          ),
      });

    return toEntity(record);
  }

  async update(
    passwordReset: PasswordReset,
  ): Promise<PasswordReset> {
    const record =
      await db.orm.public.PasswordReset
        .where({
          id: passwordReset.id,
        })
        .update({
          tokenHash: varchar<255>(
            passwordReset.tokenHash,
          ),
          expiresAt:
            toTemporalInstant(
              passwordReset.expiresAt,
            )!,
          usedAt:
            toTemporalInstant(
              passwordReset.usedAt,
            ),
          revokedAt:
            toTemporalInstant(
              passwordReset.revokedAt,
            ),
        });

    if (!record) {
      throw new Error(
        `Password reset not found: ${passwordReset.id}`,
      );
    }

    return toEntity(record);
  }
}