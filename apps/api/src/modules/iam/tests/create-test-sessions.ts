import 'dotenv/config';
import 'temporal-polyfill/full/global';

import { Temporal } from '@js-temporal/polyfill';

import { randomUUID } from 'node:crypto';

import { db } from '../../../prisma/db.js';

const varchar = <N extends number>(
  value: string,
) =>
  value as string & {
    readonly __varcharLength: N;
  };

const userId =
  'ecb97f89-1455-40e4-8a16-cda7c2e2d85a';

const tokenHashA =
  `test-session-a-${randomUUID()}`;

const tokenHashB =
  `test-session-b-${randomUUID()}`;

const expiresAt =
  Temporal.Now.instant().add({
    hours: 24 * 30,
  });

try {
  const sessionA =
    await db.orm.public.Session.create({
      id: randomUUID(),

      userId,

      tokenHash:
        varchar<255>(
          tokenHashA,
        ),

      ipAddress:
        varchar<45>(
          '127.0.0.1',
        ),

      userAgent:
        'Postman-Test-Session-A',

      lastActivityAt:
        Temporal.Now.instant(),

      expiresAt,

      revokedAt: null,
    });

  const sessionB =
    await db.orm.public.Session.create({
      id: randomUUID(),

      userId,

      tokenHash:
        varchar<255>(
          tokenHashB,
        ),

      ipAddress:
        varchar<45>(
          '127.0.0.1',
        ),

      userAgent:
        'Postman-Test-Session-B',

      lastActivityAt:
        Temporal.Now.instant(),

      expiresAt,

      revokedAt: null,
    });

  console.log(
    'Test sessions created:',
  );

  console.log({
    sessionA: {
      id: sessionA.id,
      tokenHash:
        sessionA.tokenHash,
      revokedAt:
        sessionA.revokedAt,
    },

    sessionB: {
      id: sessionB.id,
      tokenHash:
        sessionB.tokenHash,
      revokedAt:
        sessionB.revokedAt,
    },
  });
} finally {
  await db[Symbol.asyncDispose]();
}