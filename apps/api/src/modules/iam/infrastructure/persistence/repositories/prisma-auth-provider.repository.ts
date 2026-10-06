import { Temporal } from '@js-temporal/polyfill';

import { db } from '../../../../../prisma/db.js';

import {
  AuthProvider,
} from '../../../domain/entities/auth-provider.entity.js';

import {
  type IAuthProviderRepository,
} from '../../../domain/repositories/auth-provider.repository.js';

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

const toEntity = (record: {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
}): AuthProvider => {
  return AuthProvider.create({
    id: record.id,
    name: record.name,
    code: record.code,
    description: record.description,
    isActive: record.isActive,
    sortOrder: record.sortOrder,
    createdAt: toDate(record.createdAt)!,
    updatedAt: toDate(record.updatedAt)!,
  });
};

export class PrismaAuthProviderRepository
  implements IAuthProviderRepository
{
  async findById(
    id: string,
  ): Promise<AuthProvider | null> {
    const record =
      await db.orm.public.AuthProvider
        .where({
          id,
        })
        .first();

    if (!record) {
      return null;
    }

    return toEntity(record);
  }

  async findByCode(
    code: string,
  ): Promise<AuthProvider | null> {
    const record =
      await db.orm.public.AuthProvider
        .where({
          code: varchar<50>(code),
        })
        .first();

    if (!record) {
      return null;
    }

    return toEntity(record);
  }

  async findAllActive(): Promise<AuthProvider[]> {
    const records =
      await db.orm.public.AuthProvider
        .where({
          isActive: true,
        })
        .all();

    return records.map(toEntity);
  }

  async create(
    authProvider: AuthProvider,
  ): Promise<AuthProvider> {
    const record =
      await db.orm.public.AuthProvider.create({
        id: authProvider.id,
        name: varchar<100>(
          authProvider.name,
        ),
        code: varchar<50>(
          authProvider.code,
        ),
        description:
          authProvider.description,
        isActive: authProvider.isActive,
        sortOrder: authProvider.sortOrder,
        createdAt: toTemporalInstant(
          authProvider.createdAt,
        )!,
        updatedAt: toTemporalInstant(
          authProvider.updatedAt,
        )!,
      });

    return toEntity(record);
  }

  async update(
    authProvider: AuthProvider,
  ): Promise<AuthProvider> {
    const record =
      await db.orm.public.AuthProvider
        .where({
          id: authProvider.id,
        })
        .update({
          name: varchar<100>(
            authProvider.name,
          ),
          description:
            authProvider.description,
          isActive: authProvider.isActive,
          sortOrder: authProvider.sortOrder,
          updatedAt: toTemporalInstant(
            authProvider.updatedAt,
          )!,
        });

    if (!record) {
      throw new Error(
        `AuthProvider not found: ${authProvider.id}`,
      );
    }

    return toEntity(record);
  }
}