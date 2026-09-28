import { Test } from '@nestjs/testing';

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals';

import { db } from '../../../prisma/db.js';

import { IamModule } from '../iam.module.js';

import { UserService } from '../application/services/user.service.js';

import {
  USER_CREDENTIAL_REPOSITORY,
} from '../domain/repositories/user-credential.repository.js';

import type {
  IUserCredentialRepository,
} from '../domain/repositories/user-credential.repository.js';

import {
  SESSION_REPOSITORY,
} from '../domain/repositories/session.repository.js';

import type {
  ISessionRepository,
} from '../domain/repositories/session.repository.js';

import {
  UserCredential,
} from '../domain/entities/user-credential.entity.js';

import {
  Session,
} from '../domain/entities/session.entity.js';

describe('IAM Foundation Integration', () => {
  let userService: UserService;
  let credentialRepository: IUserCredentialRepository;
  let sessionRepository: ISessionRepository;

  const testUserId =
    '22222222-2222-2222-2222-222222222222';

  const testCredentialId =
    '33333333-3333-3333-3333-333333333333';

  const testSessionId =
    '44444444-4444-4444-4444-444444444444';

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    userService =
      moduleRef.get<UserService>(UserService);

    credentialRepository =
      moduleRef.get<IUserCredentialRepository>(
        USER_CREDENTIAL_REPOSITORY,
      );

    sessionRepository =
      moduleRef.get<ISessionRepository>(
        SESSION_REPOSITORY,
      );
  });

  afterAll(async () => {
    await db.orm.public.Session
      .where({ id: testSessionId })
      .delete();

    await db.orm.public.UserCredential
      .where({ id: testCredentialId })
      .delete();

    await db.orm.public.User
      .where({ id: testUserId })
      .delete();

    await db[Symbol.asyncDispose]();
  });

  it('should resolve the complete IAM foundation from IamModule', () => {
    expect(userService).toBeDefined();
    expect(credentialRepository).toBeDefined();
    expect(sessionRepository).toBeDefined();
  });

  it('should create user, credentials and session through IAM layers', async () => {
    const user = {
      id: testUserId,
      email: 'iam-foundation-test@smartdm.ai',
    } as import('../domain/entities/user.entity.js').User;

    const createdUser =
      await userService.create(user);

    expect(createdUser.id).toBe(testUserId);

    const credentials =
      UserCredential.createNew({
        id: testCredentialId,
        userId: testUserId,
        passwordHash: 'hashed-password-test',
      });

    const createdCredentials =
      await credentialRepository.create(
        credentials,
      );

    expect(createdCredentials.userId).toBe(
      testUserId,
    );

    expect(
      createdCredentials.passwordHash,
    ).toBe('hashed-password-test');

    const foundCredentials =
      await credentialRepository.findByUserId(
        testUserId,
      );

    expect(foundCredentials).not.toBeNull();
    expect(foundCredentials?.id).toBe(
      testCredentialId,
    );

    const session =
      Session.createNew({
        id: testSessionId,
        userId: testUserId,
        tokenHash: 'hashed-session-token-test',
        ipAddress: '127.0.0.1',
        userAgent: 'IAM Foundation Test',
        expiresAt: new Date(
          Date.now() + 60 * 60 * 1000,
        ),
      });

    const createdSession =
      await sessionRepository.create(session);

    expect(createdSession.userId).toBe(
      testUserId,
    );

    expect(createdSession.tokenHash).toBe(
      'hashed-session-token-test',
    );

    const foundSession =
      await sessionRepository.findByTokenHash(
        'hashed-session-token-test',
      );

    expect(foundSession).not.toBeNull();
    expect(foundSession?.id).toBe(
      testSessionId,
    );
  });
});