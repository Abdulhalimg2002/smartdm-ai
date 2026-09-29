
import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import {
  AuthController,
} from '../presentation/controllers/auth.controller.js';

import {
  AuthService,
} from '../application/services/auth.service.js';

import {
  User,
} from '../domain/entities/user.entity.js';

import {
  InvalidCredentialsError,
} from '../application/errors/invalid-credentials.error.js';

import type {
  ILogoutService,
} from '../application/services/logout.service.js';

import type {
  IRevokeSessionService,
} from '../application/services/revoke-session.service.js';

import type { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: User;
  token: string;
};

describe('IAM AuthController', () => {
  const logoutService = {
    logout: jest.fn<
      (token: string) => Promise<void>
    >(),
  } as unknown as ILogoutService;

  it('should login successfully', async () => {
    const user = User.createNew({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
    });

    const loginMock =
      jest.fn<
        (params: {
          email: string;
          password: string;
        }) => Promise<{
          user: User;
          token: string;
        }>
      >();

    loginMock.mockResolvedValue({
      user,
      token: 'raw-session-token',
    });

    const authService = {
      login: loginMock,
    } as unknown as AuthService;

    const revokeSessionService = {
      revokeSession: jest.fn<
        (
          sessionId: string,
          userId: string,
        ) => Promise<void>
      >(),
    } as unknown as IRevokeSessionService;

    const controller =
      new AuthController(
        authService,
        logoutService,
        revokeSessionService,
      );

    const result =
      await controller.login({
        email: 'abdul@example.com',
        password: 'StrongPassword123!',
      });

    expect(
      loginMock,
    ).toHaveBeenCalledWith({
      email: 'abdul@example.com',
      password: 'StrongPassword123!',
    });

    expect(result).toEqual({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        emailVerifiedAt:
          user.emailVerifiedAt,
        lastLoginAt:
          user.lastLoginAt,
        createdAt:
          user.createdAt,
        updatedAt:
          user.updatedAt,
      },
      token: 'raw-session-token',
    });
  });

  it('should throw UnauthorizedException when credentials are invalid', async () => {
    const loginMock =
      jest.fn<
        (params: {
          email: string;
          password: string;
        }) => Promise<{
          user: User;
          token: string;
        }>
      >();

    loginMock.mockRejectedValue(
      new InvalidCredentialsError(),
    );

    const authService = {
      login: loginMock,
    } as unknown as AuthService;

    const revokeSessionService = {
      revokeSession: jest.fn<
        (
          sessionId: string,
          userId: string,
        ) => Promise<void>
      >(),
    } as unknown as IRevokeSessionService;

    const controller =
      new AuthController(
        authService,
        logoutService,
        revokeSessionService,
      );

    await expect(
      controller.login({
        email: 'abdul@example.com',
        password: 'WrongPassword123!',
      }),
    ).rejects.toMatchObject({
      status: 401,
      message: 'Invalid credentials',
    });
  });

  it('should revoke a session successfully', async () => {
    const user = User.createNew({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
    });

    const revokeSessionMock =
      jest.fn<
        (
          sessionId: string,
          userId: string,
        ) => Promise<void>
      >();

    const revokeSessionService = {
      revokeSession: revokeSessionMock,
    } as unknown as IRevokeSessionService;

    const authService = {
      login: jest.fn(),
    } as unknown as AuthService;

    const controller =
      new AuthController(
        authService,
        logoutService,
        revokeSessionService,
      );

    const request = {
      user,
    } as AuthenticatedRequest;

    const result =
      await controller.revokeSession(
        'session-123',
        request,
      );

    expect(
      revokeSessionMock,
    ).toHaveBeenCalledWith(
      'session-123',
      user.id,
    );

    expect(result).toEqual({
      message: 'Session revoked successfully',
    });
  });
});

