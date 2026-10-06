import { randomUUID } from 'node:crypto';

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { AuthEvent } from '../domain/entities/auth-event.entity.js';
import { PrismaAuthEventRepository } from '../infrastructure/persistence/repositories/prisma-auth-event.repository.js';
import { db } from '../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(
  value: string,
) => value as Varchar<N>;

describe('AuthEvent Repository Integration', () => {
  let repository: PrismaAuthEventRepository;

  let authEventTypeId: string;
  let userId: string;

  beforeAll(async () => {
    repository =
      new PrismaAuthEventRepository();

    const authEventType =
      await db.orm.public.AuthEventType
        .where({
          code: varchar<50>('LOGIN'),
        })
        .first();

    if (!authEventType) {
      throw new Error(
        'LOGIN AuthEventType was not found.',
      );
    }

    authEventTypeId = authEventType.id;

    const user =
      await db.orm.public.User
        .where({
          email: varchar<255>(
            'abdulhalim12345ii@gmail.com',
          ),
        })
        .first();

    if (!user) {
      throw new Error(
        'Test user was not found.',
      );
    }

    userId = user.id;
  });

  afterAll(async () => {
    await db[Symbol.asyncDispose]();
  });

  it('should create and find an AuthEvent', async () => {
    const authEvent =
      AuthEvent.createNew({
        id: randomUUID(),
        userId,
        authEventTypeId,
        ipAddress: '127.0.0.1',
        userAgent: 'PostmanRuntime/Test',
      });

    const created =
      await repository.create(
        authEvent,
      );

    expect(created.id).toBe(
      authEvent.id,
    );

    expect(created.userId).toBe(
      userId,
    );

    expect(created.authEventTypeId).toBe(
      authEventTypeId,
    );

    const found =
      await repository.findById(
        authEvent.id,
      );

    expect(found).not.toBeNull();

    expect(found?.id).toBe(
      authEvent.id,
    );

    expect(found?.userId).toBe(
      userId,
    );
  });

  it('should find AuthEvents by userId', async () => {
    const events =
      await repository.findByUserId(
        userId,
      );

    expect(events.length).toBeGreaterThan(0);

    expect(
      events.some(
        (event) =>
          event.userId === userId,
      ),
    ).toBe(true);
  });
});