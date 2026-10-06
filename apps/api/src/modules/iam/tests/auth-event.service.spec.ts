import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { AuthEventService } from '../application/services/auth-event.service.impl.js';

import type {
  IAuthEventRepository,
} from '../domain/repositories/auth-event.repository.js';

import type {
  IAuthEventTypeRepository,
} from '../domain/repositories/auth-event-type.repository.js';

describe('AuthEventService', () => {
  let service: AuthEventService;

  const authEventRepository: {
    findById: jest.MockedFunction<
      IAuthEventRepository['findById']
    >;

    create: jest.MockedFunction<
      IAuthEventRepository['create']
    >;

    findByUserId: jest.MockedFunction<
      IAuthEventRepository['findByUserId']
    >;
  } = {
    findById: jest.fn(),
    create: jest.fn(),
    findByUserId: jest.fn(),
  };

  const authEventTypeRepository: {
    findByCode: jest.MockedFunction<
      IAuthEventTypeRepository['findByCode']
    >;
  } = {
    findByCode: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service =
      new AuthEventService(
        authEventRepository,
        authEventTypeRepository,
      );
  });

  it('should create and persist an auth event', async () => {
    authEventTypeRepository.findByCode.mockResolvedValue(
      {
        id: 'event-type-login',
        code: 'LOGIN',
        name: 'Login',
        description: null,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    );

    authEventRepository.create.mockImplementation(
      async (authEvent) => authEvent,
    );

    const result =
      await service.record({
        userId: 'user-1',
        type: 'LOGIN',
        ipAddress: '127.0.0.1',
        userAgent: 'PostmanRuntime/Test',
      });

    expect(result.id).toBeDefined();

    expect(result.userId).toBe(
      'user-1',
    );

    expect(result.authEventTypeId).toBe(
      'event-type-login',
    );

    expect(result.ipAddress).toBe(
      '127.0.0.1',
    );

    expect(result.userAgent).toBe(
      'PostmanRuntime/Test',
    );

    expect(
      authEventTypeRepository.findByCode,
    ).toHaveBeenCalledTimes(1);

    expect(
      authEventTypeRepository.findByCode,
    ).toHaveBeenCalledWith('LOGIN');

    expect(
      authEventRepository.create,
    ).toHaveBeenCalledTimes(1);

    expect(
      authEventRepository.create,
    ).toHaveBeenCalledWith(result);
  });

  it('should create an auth event without a user', async () => {
    authEventTypeRepository.findByCode.mockResolvedValue(
      {
        id: 'event-type-login-failed',
        code: 'LOGIN_FAILED',
        name: 'Login Failed',
        description: null,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    );

    authEventRepository.create.mockImplementation(
      async (authEvent) => authEvent,
    );

    const result =
      await service.record({
        userId: null,
        type: 'LOGIN_FAILED',
        ipAddress: '127.0.0.1',
        userAgent: 'PostmanRuntime/Test',
      });

    expect(result.id).toBeDefined();

    expect(result.userId).toBeNull();

    expect(result.authEventTypeId).toBe(
      'event-type-login-failed',
    );

    expect(
      authEventTypeRepository.findByCode,
    ).toHaveBeenCalledWith(
      'LOGIN_FAILED',
    );

    expect(
      authEventRepository.create,
    ).toHaveBeenCalledTimes(1);
  });

  it('should pass null values when optional data is omitted', async () => {
    authEventTypeRepository.findByCode.mockResolvedValue(
      {
        id: 'event-type-login',
        code: 'LOGIN',
        name: 'Login',
        description: null,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    );

    authEventRepository.create.mockImplementation(
      async (authEvent) => authEvent,
    );

    const result =
      await service.record({
        type: 'LOGIN',
      });

    expect(result.userId).toBeNull();

    expect(result.ipAddress).toBeNull();

    expect(result.userAgent).toBeNull();

    expect(result.authEventTypeId).toBe(
      'event-type-login',
    );

    expect(
      authEventTypeRepository.findByCode,
    ).toHaveBeenCalledWith('LOGIN');

    expect(
      authEventRepository.create,
    ).toHaveBeenCalledTimes(1);
  });

  it('should throw when auth event type does not exist', async () => {
    authEventTypeRepository.findByCode.mockResolvedValue(
      null,
    );

    await expect(
      service.record({
        userId: 'user-1',
        type: 'UNKNOWN_EVENT',
      }),
    ).rejects.toThrow(
      'Auth event type not found: UNKNOWN_EVENT',
    );

    expect(
      authEventTypeRepository.findByCode,
    ).toHaveBeenCalledWith(
      'UNKNOWN_EVENT',
    );

    expect(
      authEventRepository.create,
    ).not.toHaveBeenCalled();
  });
});