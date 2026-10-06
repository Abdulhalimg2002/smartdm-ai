import { Temporal } from '@js-temporal/polyfill';

import { db } from '../../../../../prisma/db.js';

import {
  UserAuthProvider,
} from '../../../domain/entities/user-auth-provider.entity.js';

import {
  type IUserAuthProviderRepository,
} from '../../../domain/repositories/user-auth-provider.repository.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

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

export class PrismaUserAuthProviderRepository
  implements IUserAuthProviderRepository
{
  async findById(
    id: string,
  ): Promise<UserAuthProvider | null> {
    const record =
      await db.orm.public.UserAuthProvider
        .where({
          id,
        })
        .first();

    if (!record) {
      return null;
    }

    return UserAuthProvider.create({
      id: record.id,
      userId: record.userId,
      authProviderId: record.authProviderId,
      providerUserId: record.providerUserId,
      providerEmail: record.providerEmail,
      isActive: record.isActive,
      lastUsedAt: toDate(record.lastUsedAt),
      createdAt: toDate(record.createdAt)!,
      updatedAt: toDate(record.updatedAt)!,
    });
  }

  async findByUserAndProvider(
    userId: string,
    authProviderId: string,
  ): Promise<UserAuthProvider | null> {
    const record =
      await db.orm.public.UserAuthProvider
        .where({
          userId,
          authProviderId,
        })
        .first();

    if (!record) {
      return null;
    }

    return UserAuthProvider.create({
      id: record.id,
      userId: record.userId,
      authProviderId: record.authProviderId,
      providerUserId: record.providerUserId,
      providerEmail: record.providerEmail,
      isActive: record.isActive,
      lastUsedAt: toDate(record.lastUsedAt),
      createdAt: toDate(record.createdAt)!,
      updatedAt: toDate(record.updatedAt)!,
    });
  }

  async findByProviderUserId(
    authProviderId: string,
    providerUserId: string,
  ): Promise<UserAuthProvider | null> {
    const record =
      await db.orm.public.UserAuthProvider
        .where({
          authProviderId,
          providerUserId: varchar<255>(
            providerUserId,
          ),
        })
        .first();

    if (!record) {
      return null;
    }

    return UserAuthProvider.create({
      id: record.id,
      userId: record.userId,
      authProviderId: record.authProviderId,
      providerUserId: record.providerUserId,
      providerEmail: record.providerEmail,
      isActive: record.isActive,
      lastUsedAt: toDate(record.lastUsedAt),
      createdAt: toDate(record.createdAt)!,
      updatedAt: toDate(record.updatedAt)!,
    });
  }

  async create(
    userAuthProvider: UserAuthProvider,
  ): Promise<UserAuthProvider> {
    const record =
      await db.orm.public.UserAuthProvider.create({
        id: userAuthProvider.id,
        userId: userAuthProvider.userId,
        authProviderId:
          userAuthProvider.authProviderId,
        providerUserId:
          userAuthProvider.providerUserId
            ? varchar<255>(
                userAuthProvider.providerUserId,
              )
            : null,
        providerEmail:
          userAuthProvider.providerEmail
            ? varchar<255>(
                userAuthProvider.providerEmail,
              )
            : null,
        isActive: userAuthProvider.isActive,
        lastUsedAt: toTemporalInstant(
          userAuthProvider.lastUsedAt,
        ),
        createdAt: toTemporalInstant(
          userAuthProvider.createdAt,
        )!,
        updatedAt: toTemporalInstant(
          userAuthProvider.updatedAt,
        )!,
      });

    return UserAuthProvider.create({
      id: record.id,
      userId: record.userId,
      authProviderId: record.authProviderId,
      providerUserId: record.providerUserId,
      providerEmail: record.providerEmail,
      isActive: record.isActive,
      lastUsedAt: toDate(record.lastUsedAt),
      createdAt: toDate(record.createdAt)!,
      updatedAt: toDate(record.updatedAt)!,
    });
  }

  async update(
    userAuthProvider: UserAuthProvider,
  ): Promise<UserAuthProvider> {
    const record =
      await db.orm.public.UserAuthProvider
        .where({
          id: userAuthProvider.id,
        })
        .update({
          userId: userAuthProvider.userId,
          authProviderId:
            userAuthProvider.authProviderId,
          providerUserId:
            userAuthProvider.providerUserId
              ? varchar<255>(
                  userAuthProvider.providerUserId,
                )
              : null,
          providerEmail:
            userAuthProvider.providerEmail
              ? varchar<255>(
                  userAuthProvider.providerEmail,
                )
              : null,
          isActive: userAuthProvider.isActive,
          lastUsedAt: toTemporalInstant(
            userAuthProvider.lastUsedAt,
          ),
          updatedAt: toTemporalInstant(
            userAuthProvider.updatedAt,
          )!,
        });

    if (!record) {
      throw new Error(
        `UserAuthProvider not found: ${userAuthProvider.id}`,
      );
    }

    return UserAuthProvider.create({
      id: record.id,
      userId: record.userId,
      authProviderId: record.authProviderId,
      providerUserId: record.providerUserId,
      providerEmail: record.providerEmail,
      isActive: record.isActive,
      lastUsedAt: toDate(record.lastUsedAt),
      createdAt: toDate(record.createdAt)!,
      updatedAt: toDate(record.updatedAt)!,
    });
  }
}