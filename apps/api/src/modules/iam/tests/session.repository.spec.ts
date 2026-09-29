import { Test } from '@nestjs/testing';

import {
  afterAll,
  describe,
  it,
  expect,
} from '@jest/globals';

import { db } from '../../../prisma/db.js';

import { IamModule } from '../iam.module.js';

import {
  SESSION_REPOSITORY,
  ISessionRepository,
} from '../domain/repositories/session.repository.js';

import {
  USER_REPOSITORY,
  IUserRepository,
} from '../domain/repositories/user.repository.js';

import {
  User,
  UserStatus,
} from '../domain/entities/user.entity.js';

import { Session } from '../domain/entities/session.entity.js';

describe('IAM Session Repository', () => {
  it('should resolve ISessionRepository', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IamModule],
    }).compile();

    const repository =
      moduleRef.get<ISessionRepository>(
        SESSION_REPOSITORY,
      );

    expect(repository).toBeDefined();
  });
  

  it('should create, find and update a session', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IamModule],
    }).compile();

    const userRepository =
      moduleRef.get<IUserRepository>(
        USER_REPOSITORY,
      );

    const sessionRepository =
      moduleRef.get<ISessionRepository>(
        SESSION_REPOSITORY,
      );

    const user = User.create({
      id: crypto.randomUUID(),
      email: `session-test-${Date.now()}@example.com`,
      firstName: 'Session',
      lastName: 'Test',
      status: UserStatus.ACTIVE,
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      const createdUser =
        await userRepository.create(user);

      expect(createdUser.id).toBe(user.id);

      const session = Session.createNew({
        id: crypto.randomUUID(),
        userId: user.id,
        tokenHash: `session-token-hash-${Date.now()}`,
        ipAddress: '127.0.0.1',
        userAgent: 'Jest Test Agent',
        expiresAt: new Date(
          Date.now() + 60 * 60 * 1000,
        ),
      });

      const createdSession =
        await sessionRepository.create(session);

      expect(createdSession.id).toBe(session.id);
      expect(createdSession.userId).toBe(user.id);
      expect(createdSession.tokenHash).toBe(
        session.tokenHash,
      );
      expect(createdSession.ipAddress).toBe(
        '127.0.0.1',
      );
      expect(createdSession.userAgent).toBe(
        'Jest Test Agent',
      );

      const foundById =
        await sessionRepository.findById(
          session.id,
        );

      expect(foundById).not.toBeNull();
      expect(foundById?.id).toBe(session.id);

      const foundByTokenHash =
        await sessionRepository.findByTokenHash(
          session.tokenHash,
        );

      expect(foundByTokenHash).not.toBeNull();
      expect(foundByTokenHash?.userId).toBe(user.id);

      const updatedSession = Session.create({
        id: session.id,
        userId: session.userId,
        tokenHash: session.tokenHash,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        lastActivityAt: new Date(),
        expiresAt: session.expiresAt,
        revokedAt: new Date(),
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      });

      const savedSession =
        await sessionRepository.update(
          updatedSession,
        );

      expect(savedSession.revokedAt).not.toBeNull();

      const foundAfterUpdate =
        await sessionRepository.findById(
          session.id,
        );

      expect(foundAfterUpdate?.revokedAt).not.toBeNull();
    } finally {
      await db.orm.public.User
        .where({ id: user.id })
        .delete();
    }
  });

  afterAll(async () => {
    await db[Symbol.asyncDispose]();
  });
});