
import { Test } from '@nestjs/testing';

import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { UserService } from '../application/services/user.service.js';

import {
  USER_REPOSITORY,
} from '../domain/repositories/user.repository.js';

import {
  User,
} from '../domain/entities/user.entity.js';

describe('IAM User Service', () => {
  const mockUser = {
    id: 'user-test-id',
    email: 'test@smartdm.ai',
  } as User;

  it('should resolve UserService with IUserRepository', async () => {
    const mockRepository = {
      findById: jest.fn(
        async (_id: string) => null,
      ),
      findByEmail: jest.fn(
        async (_email: string) => null,
      ),
      create: jest.fn(
        async (user: User) => user,
      ),
      update: jest.fn(
        async (user: User) => user,
      ),
    };

    const moduleRef =
      await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: USER_REPOSITORY,
            useValue: mockRepository,
          },
        ],
      }).compile();

    const service =
      moduleRef.get<UserService>(UserService);

    expect(service).toBeDefined();
  });

  it('should delegate findById to the repository', async () => {
    const mockRepository = {
      findById: jest.fn(
        async (_id: string) => mockUser,
      ),
      findByEmail: jest.fn(
        async (_email: string) => null,
      ),
      create: jest.fn(
        async (user: User) => user,
      ),
      update: jest.fn(
        async (user: User) => user,
      ),
    };

    const moduleRef =
      await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: USER_REPOSITORY,
            useValue: mockRepository,
          },
        ],
      }).compile();

    const service =
      moduleRef.get<UserService>(UserService);

    const result = await service.findById(
      mockUser.id,
    );

    expect(result).toBe(mockUser);

    expect(
      mockRepository.findById,
    ).toHaveBeenCalledWith(mockUser.id);
  });

  it('should delegate findByEmail to the repository', async () => {
    const mockRepository = {
      findById: jest.fn(
        async (_id: string) => null,
      ),
      findByEmail: jest.fn(
        async (_email: string) => mockUser,
      ),
      create: jest.fn(
        async (user: User) => user,
      ),
      update: jest.fn(
        async (user: User) => user,
      ),
    };

    const moduleRef =
      await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: USER_REPOSITORY,
            useValue: mockRepository,
          },
        ],
      }).compile();

    const service =
      moduleRef.get<UserService>(UserService);

    const result = await service.findByEmail(
      mockUser.email,
    );

    expect(result).toBe(mockUser);

    expect(
      mockRepository.findByEmail,
    ).toHaveBeenCalledWith(mockUser.email);
  });

  it('should delegate create to the repository', async () => {
    const mockRepository = {
      findById: jest.fn(
        async (_id: string) => null,
      ),
      findByEmail: jest.fn(
        async (_email: string) => null,
      ),
      create: jest.fn(
        async (user: User) => user,
      ),
      update: jest.fn(
        async (user: User) => user,
      ),
    };

    const moduleRef =
      await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: USER_REPOSITORY,
            useValue: mockRepository,
          },
        ],
      }).compile();

    const service =
      moduleRef.get<UserService>(UserService);

    const result =
      await service.create(mockUser);

    expect(result).toBe(mockUser);

    expect(
      mockRepository.create,
    ).toHaveBeenCalledWith(mockUser);
  });

  it('should delegate update to the repository', async () => {
    const mockRepository = {
      findById: jest.fn(
        async (_id: string) => null,
      ),
      findByEmail: jest.fn(
        async (_email: string) => null,
      ),
      create: jest.fn(
        async (user: User) => user,
      ),
      update: jest.fn(
        async (user: User) => user,
      ),
    };

    const moduleRef =
      await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: USER_REPOSITORY,
            useValue: mockRepository,
          },
        ],
      }).compile();

    const service =
      moduleRef.get<UserService>(UserService);

    const result =
      await service.update(mockUser);

    expect(result).toBe(mockUser);

    expect(
      mockRepository.update,
    ).toHaveBeenCalledWith(mockUser);
  });
});

