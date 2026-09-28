
import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { AuthService } from '../application/services/auth.service.js';

import { UserService } from '../application/services/user.service.js';

import type {
  IUserCredentialRepository,
} from '../domain/repositories/user-credential.repository.js';

import type {
  IPasswordHasher,
} from '../application/services/password-hasher.service.js';

describe('IAM AuthService', () => {
  it('should register a new user', async () => {
    const findByEmailMock =
      jest.fn<(email: string) => Promise<unknown>>();

    const createUserMock =
      jest.fn<() => Promise<unknown>>();

    const createCredentialMock =
      jest.fn<() => Promise<unknown>>();

    const hashMock =
      jest.fn<(password: string) => Promise<string>>();

    const compareMock =
      jest.fn<
        (
          password: string,
          passwordHash: string,
        ) => Promise<boolean>
      >();

    findByEmailMock.mockResolvedValue(null);

    hashMock.mockResolvedValue(
      'hashed-password',
    );

    const userService = {
      findByEmail: findByEmailMock,
      create: createUserMock,
    } as unknown as UserService;

    const credentialRepository = {
      create: createCredentialMock,
    } as unknown as IUserCredentialRepository;

    const passwordHasher: IPasswordHasher = {
      hash: hashMock,
      compare: compareMock,
    };

    const authService = new AuthService(
      userService,
      credentialRepository,
      passwordHasher,
    );

    const result =
      await authService.register({
        email: 'test@example.com',
        password: 'StrongPassword123!',
        firstName: 'Abdul',
        lastName: 'Halim',
      });

    expect(
      findByEmailMock,
    ).toHaveBeenCalledWith(
      'test@example.com',
    );

    expect(
      hashMock,
    ).toHaveBeenCalledWith(
      'StrongPassword123!',
    );

    expect(
      createUserMock,
    ).toHaveBeenCalledTimes(1);

    expect(
      createCredentialMock,
    ).toHaveBeenCalledTimes(1);

    expect(result.email).toBe(
      'test@example.com',
    );

    expect(result.firstName).toBe(
      'Abdul',
    );

    expect(result.lastName).toBe(
      'Halim',
    );
  });

  it('should reject registration when email already exists', async () => {
    const findByEmailMock =
      jest.fn<(email: string) => Promise<unknown>>();

    const createUserMock =
      jest.fn<() => Promise<unknown>>();

    const createCredentialMock =
      jest.fn<() => Promise<unknown>>();

    const hashMock =
      jest.fn<(password: string) => Promise<string>>();

    const compareMock =
      jest.fn<
        (
          password: string,
          passwordHash: string,
        ) => Promise<boolean>
      >();

    const existingUser = {
      id: 'existing-user-id',
      email: 'test@example.com',
    };

    findByEmailMock.mockResolvedValue(
      existingUser,
    );

    const userService = {
      findByEmail: findByEmailMock,
      create: createUserMock,
    } as unknown as UserService;

    const credentialRepository = {
      create: createCredentialMock,
    } as unknown as IUserCredentialRepository;

    const passwordHasher: IPasswordHasher = {
      hash: hashMock,
      compare: compareMock,
    };

    const authService = new AuthService(
      userService,
      credentialRepository,
      passwordHasher,
    );

    await expect(
      authService.register({
        email: 'test@example.com',
        password: 'StrongPassword123!',
        firstName: 'Abdul',
        lastName: 'Halim',
      }),
    ).rejects.toThrow(
      'Email already registered',
    );

    expect(
      hashMock,
    ).not.toHaveBeenCalled();

    expect(
      createUserMock,
    ).not.toHaveBeenCalled();

    expect(
      createCredentialMock,
    ).not.toHaveBeenCalled();
  });
});

