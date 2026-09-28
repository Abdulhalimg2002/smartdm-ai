
import { Test } from '@nestjs/testing';

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals';

import { db } from '../../../prisma/db.js';

import { UserService } from '../application/services/user.service.js';

import {
  User,
} from '../domain/entities/user.entity.js';

import {
  IamModule,
} from '../iam.module.js';

describe('IAM User Service Integration', () => {
  let userService: UserService;

  const testUserId = '11111111-1111-1111-1111-111111111111';

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    userService =
      moduleRef.get<UserService>(UserService);
  });

  afterAll(async () => {
    await db.orm.public.User
      .where({ id: testUserId })
      .delete();

    await db[Symbol.asyncDispose]();
  });

  it('should resolve UserService from IamModule', () => {
    expect(userService).toBeDefined();
  });

  it('should create and find a user through UserService', async () => {
    const user = {
      id: testUserId,
      email: 'user-service-test@smartdm.ai',
    } as User;

    const created =
      await userService.create(user);

    expect(created.id).toBe(testUserId);
    expect(created.email).toBe(
      'user-service-test@smartdm.ai',
    );

    const foundById =
      await userService.findById(testUserId);

    expect(foundById).not.toBeNull();
    expect(foundById?.id).toBe(testUserId);
    expect(foundById?.email).toBe(
      'user-service-test@smartdm.ai',
    );

    const foundByEmail =
      await userService.findByEmail(
        'user-service-test@smartdm.ai',
      );

    expect(foundByEmail).not.toBeNull();
    expect(foundByEmail?.id).toBe(testUserId);
  });
});

