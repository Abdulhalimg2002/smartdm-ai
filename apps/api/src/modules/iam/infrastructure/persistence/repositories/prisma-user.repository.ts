import { Temporal } from '@js-temporal/polyfill';

import { db } from '../../../../../prisma/db.js';

import {
  User,
  UserStatus,
} from '../../../domain/entities/user.entity.js';

import { IUserRepository } from '../../../domain/repositories/user.repository.js';

const varchar = <N extends number>(value: string) =>
  value as string & {
    readonly __varcharLength: N;
  };

const toTemporalInstant = (
  value: Date | Temporal.Instant | null,
): Temporal.Instant | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Temporal.Instant.fromEpochMilliseconds(
      value.getTime(),
    );
  }

  return Temporal.Instant.fromEpochMilliseconds(
    Number(value.epochMilliseconds),
  );
};

const toDate = (
  value: Date | Temporal.Instant | null,
): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  return new Date(
    Number(value.epochMilliseconds),
  );
};

export class PrismaUserRepository
  implements IUserRepository
{
  async findById(
    id: string,
  ): Promise<User | null> {
    const record =
      await db.orm.public.User
        .where({ id })
        .first();

    if (!record) {
      return null;
    }

    return User.create({
      id: record.id,
      email: record.email,
      firstName: record.firstName,
      lastName: record.lastName,
      status: record.status as UserStatus,
     emailVerifiedAt:
  toDate(record.emailVerifiedAt),

lastLoginAt:
  toDate(record.lastLoginAt),

createdAt:
  toDate(record.createdAt)!,

updatedAt:
  toDate(record.updatedAt)!,
    });
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    const record =
      await db.orm.public.User
        .where({
          email: varchar<255>(email),
        })
        .first();

    if (!record) {
      return null;
    }

    return User.create({
      id: record.id,
      email: record.email,
      firstName: record.firstName,
      lastName: record.lastName,
      status: record.status as UserStatus,
     emailVerifiedAt:
    toDate(record.emailVerifiedAt),
  lastLoginAt:
    toDate(record.lastLoginAt),
  createdAt:
    toDate(record.createdAt)!,
  updatedAt:
    toDate(record.updatedAt)!,
    });
  }

  async create(
    user: User,
  ): Promise<User> {
    const record =
      await db.orm.public.User.create({
        id: user.id,

        email: varchar<255>(
          user.email,
        ),

        firstName: user.firstName
          ? varchar<100>(
              user.firstName,
            )
          : null,

        lastName: user.lastName
          ? varchar<100>(
              user.lastName,
            )
          : null,

        status: user.status,

        emailVerifiedAt:
          toTemporalInstant(
            user.emailVerifiedAt,
          ),

        lastLoginAt:
          toTemporalInstant(
            user.lastLoginAt,
          ),
      });

    return User.create({
      id: record.id,
      email: record.email,
      firstName: record.firstName,
      lastName: record.lastName,
      status: record.status as UserStatus,
      emailVerifiedAt:
    toDate(record.emailVerifiedAt),
  lastLoginAt:
    toDate(record.lastLoginAt),
  createdAt:
    toDate(record.createdAt)!,
  updatedAt:
    toDate(record.updatedAt)!,
    });
  }

  async update(
    user: User,
  ): Promise<User> {
    const record =
      await db.orm.public.User
        .where({ id: user.id })
        .update({
          email: varchar<255>(
            user.email,
          ),

          firstName: user.firstName
            ? varchar<100>(
                user.firstName,
              )
            : null,

          lastName: user.lastName
            ? varchar<100>(
                user.lastName,
              )
            : null,

          status: user.status,

          emailVerifiedAt:
            toTemporalInstant(
              user.emailVerifiedAt,
            ),

          lastLoginAt:
            toTemporalInstant(
              user.lastLoginAt,
            ),
        });

    if (!record) {
      throw new Error(
        `User not found: ${user.id}`,
      );
    }

    return User.create({
      id: record.id,
      email: record.email,
      firstName: record.firstName,
      lastName: record.lastName,
      status: record.status as UserStatus,
     emailVerifiedAt:
    toDate(record.emailVerifiedAt),
  lastLoginAt:
    toDate(record.lastLoginAt),
  createdAt:
    toDate(record.createdAt)!,
  updatedAt:
    toDate(record.updatedAt)!,
    });
  }
}