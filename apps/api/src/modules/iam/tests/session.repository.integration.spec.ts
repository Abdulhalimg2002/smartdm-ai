import 'dotenv/config';

import {
  afterAll,
  describe,
  expect,
  it,
} from '@jest/globals';

import { randomUUID } from 'node:crypto';

import { db } from '../../../prisma/db.js';

import {
  Session,
} from '../domain/entities/session.entity.js';

import {
  PrismaSessionRepository,
} from '../infrastructure/persistence/repositories/prisma-session.repository.js';

describe(
  'PrismaSessionRepository Integration',
  () => {
    afterAll(async () => {
      await db[Symbol.asyncDispose]();
    });

    it(
      'should revoke all active sessions for a user',
      async () => {
        const repository =
          new PrismaSessionRepository();

        const userId =
          'ecb97f89-1455-40e4-8a16-cda7c2e2d85a';

        const session1 =
          Session.createNew({
            id: randomUUID(),
            userId,
            tokenHash:
              `test-session-1-${randomUUID()}`,
            expiresAt:
              new Date(
                Date.now() +
                  60 * 60 * 1000,
              ),
          });

        const session2 =
          Session.createNew({
            id: randomUUID(),
            userId,
            tokenHash:
              `test-session-2-${randomUUID()}`,
            expiresAt:
              new Date(
                Date.now() +
                  60 * 60 * 1000,
              ),
          });

        await repository.create(
          session1,
        );

        await repository.create(
          session2,
        );

        await repository.revokeAllByUserId(
          userId,
        );

        const revokedSession1 =
          await repository.findById(
            session1.id,
          );

        const revokedSession2 =
          await repository.findById(
            session2.id,
          );

        expect(
          revokedSession1,
        ).not.toBeNull();

        expect(
          revokedSession2,
        ).not.toBeNull();

        expect(
          revokedSession1!.revokedAt,
        ).not.toBeNull();

        expect(
          revokedSession2!.revokedAt,
        ).not.toBeNull();
      },
    );
  },
);