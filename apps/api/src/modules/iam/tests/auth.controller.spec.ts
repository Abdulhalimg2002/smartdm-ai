
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

    const controller =
      new AuthController(
        authService,
        logoutService,
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

    const controller =
      new AuthController(
        authService,
        logoutService,
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
});
