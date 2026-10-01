import { Temporal } from '@js-temporal/polyfill';

import { db } from '../../../../../prisma/db.js';

import { Session } from '../../../domain/entities/session.entity.js';

import {
  ISessionRepository,
} from '../../../domain/repositories/session.repository.js';

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

export class PrismaSessionRepository
  implements ISessionRepository
{
  async findById(id: string): Promise<Session | null> {
    const record = await db.orm.public.Session
      .where({ id })
      .first();

    if (!record) {
      return null;
    }

    return Session.create({
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
      lastActivityAt: toDate(record.lastActivityAt)!,
      expiresAt: toDate(record.expiresAt)!,
      revokedAt: toDate(record.revokedAt),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<Session | null> {
    const record = await db.orm.public.Session
      .where({
        tokenHash: varchar<255>(tokenHash),
      })
      .first();

    if (!record) {
      return null;
    }

    return Session.create({
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
      lastActivityAt: toDate(record.lastActivityAt)!,
      expiresAt: toDate(record.expiresAt)!,
      revokedAt: toDate(record.revokedAt),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async create(session: Session): Promise<Session> {
    const record = await db.orm.public.Session.create({
      id: session.id,
      userId: session.userId,
      tokenHash: varchar<255>(session.tokenHash),
      ipAddress: session.ipAddress
        ? varchar<45>(session.ipAddress)
        : null,
      userAgent: session.userAgent,
      lastActivityAt: toTemporalInstant(
        session.lastActivityAt,
      )!,
      expiresAt: toTemporalInstant(
        session.expiresAt,
      )!,
      revokedAt: toTemporalInstant(
        session.revokedAt,
      ),
    });

    return Session.create({
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
      lastActivityAt: toDate(record.lastActivityAt)!,
      expiresAt: toDate(record.expiresAt)!,
      revokedAt: toDate(record.revokedAt),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async update(session: Session): Promise<Session> {
    const record = await db.orm.public.Session
      .where({ id: session.id })
      .update({
        tokenHash: varchar<255>(session.tokenHash),
        ipAddress: session.ipAddress
          ? varchar<45>(session.ipAddress)
          : null,
        userAgent: session.userAgent,
        lastActivityAt: toTemporalInstant(
          session.lastActivityAt,
        )!,
        expiresAt: toTemporalInstant(
          session.expiresAt,
        )!,
        revokedAt: toTemporalInstant(
          session.revokedAt,
        ),
      });

    if (!record) {
      throw new Error(`Session not found: ${session.id}`);
    }

    return Session.create({
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
      lastActivityAt: toDate(record.lastActivityAt)!,
      expiresAt: toDate(record.expiresAt)!,
      revokedAt: toDate(record.revokedAt),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  async revokeAllByUserId(
  userId: string,
): Promise<void> {
  const sessions =
    await db.orm.public.Session
      .where({
        userId,
      })
      .all();

  const activeSessions =
    sessions.filter(
      (session) =>
        session.revokedAt === null,
      );

  await Promise.all(
    activeSessions.map(
      async (session) => {
        await db.orm.public.Session
          .where({
            id: session.id,
          })
          .update({
            revokedAt:
              Temporal.Now.instant(),
          });
      },
    ),
  );
}
}