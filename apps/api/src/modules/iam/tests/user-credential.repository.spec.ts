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
  USER_REPOSITORY,
  IUserRepository,
} from '../domain/repositories/user.repository.js';

import {
  USER_CREDENTIAL_REPOSITORY,
  IUserCredentialRepository,
} from '../domain/repositories/user-credential.repository.js';

import {
  User,
  UserStatus,
} from '../domain/entities/user.entity.js';

import { UserCredential } from '../domain/entities/user-credential.entity.js';

describe('IAM User Credential Repository', () => {
  it('should resolve IUserCredentialRepository', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IamModule],
    }).compile();

    const repository =
      moduleRef.get<IUserCredentialRepository>(
        USER_CREDENTIAL_REPOSITORY,
      );

    expect(repository).toBeDefined();
  });

  it('should create, find and update user credentials', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IamModule],
    }).compile();

    const userRepository =
      moduleRef.get<IUserRepository>(USER_REPOSITORY);

    const credentialRepository =
      moduleRef.get<IUserCredentialRepository>(
        USER_CREDENTIAL_REPOSITORY,
      );

    const user = User.create({
      id: crypto.randomUUID(),
      email: `credential-test-${Date.now()}@example.com`,
      firstName: 'Credential',
      lastName: 'Test',
      status: UserStatus.ACTIVE,
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      const createdUser = await userRepository.create(user);

      expect(createdUser.id).toBe(user.id);

      const credentials = UserCredential.createNew({
        id: crypto.randomUUID(),
        userId: user.id,
        passwordHash: 'hashed-password-v1',
      });

      const createdCredentials =
        await credentialRepository.create(credentials);

      expect(createdCredentials.id).toBe(credentials.id);
      expect(createdCredentials.userId).toBe(user.id);
      expect(createdCredentials.passwordHash).toBe(
        'hashed-password-v1',
      );

      const foundCredentials =
        await credentialRepository.findByUserId(user.id);

      expect(foundCredentials).not.toBeNull();
      expect(foundCredentials?.userId).toBe(user.id);
      expect(foundCredentials?.passwordHash).toBe(
        'hashed-password-v1',
      );

      const updatedCredentials = UserCredential.create({
        id: credentials.id,
        userId: user.id,
        passwordHash: 'hashed-password-v2',
        passwordChangedAt: new Date(),
        createdAt: credentials.createdAt,
        updatedAt: credentials.updatedAt,
      });

      const savedCredentials =
        await credentialRepository.update(
          updatedCredentials,
        );

      expect(savedCredentials.passwordHash).toBe(
        'hashed-password-v2',
      );

      const foundAfterUpdate =
        await credentialRepository.findByUserId(user.id);

      expect(foundAfterUpdate?.passwordHash).toBe(
        'hashed-password-v2',
      );
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