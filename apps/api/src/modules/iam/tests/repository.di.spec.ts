
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
  User,
  UserStatus,
} from '../domain/entities/user.entity.js';

describe('IAM Repository', () => {
  it('should resolve IUserRepository', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IamModule],
    }).compile();

    const repository = moduleRef.get<IUserRepository>(
      USER_REPOSITORY,
    );

    expect(repository).toBeDefined();
  });

  it('should create, find and update a user', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IamModule],
    }).compile();

    const repository = moduleRef.get<IUserRepository>(
      USER_REPOSITORY,
    );

    const user = User.create({
      id: crypto.randomUUID(),
      email: `repository-test-${Date.now()}@example.com`,
      firstName: 'Repository',
      lastName: 'Test',
      status: UserStatus.ACTIVE,
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      const createdUser = await repository.create(user);

      expect(createdUser.id).toBe(user.id);
      expect(createdUser.email).toBe(user.email);

      const foundById = await repository.findById(user.id);

      expect(foundById).not.toBeNull();
      expect(foundById?.email).toBe(user.email);

      const foundByEmail = await repository.findByEmail(user.email);

      expect(foundByEmail).not.toBeNull();
      expect(foundByEmail?.id).toBe(user.id);

      const updatedUser = User.create({
        id: user.id,
        email: user.email,
        firstName: 'Updated',
        lastName: 'User',
        status: UserStatus.ACTIVE,
        emailVerifiedAt: null,
        lastLoginAt: null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      const savedUser = await repository.update(updatedUser);

      expect(savedUser.firstName).toBe('Updated');
      expect(savedUser.lastName).toBe('User');

      const foundAfterUpdate = await repository.findById(user.id);

      expect(foundAfterUpdate?.firstName).toBe('Updated');
      expect(foundAfterUpdate?.lastName).toBe('User');
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

