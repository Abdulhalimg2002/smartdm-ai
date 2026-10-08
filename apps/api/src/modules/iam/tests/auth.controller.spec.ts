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

import type {
  IForgotPasswordService,
} from '../application/services/forgot-password.service.js';

import type {
  IResetPasswordService,
} from '../application/services/reset-password.service.js';

import type {
  IGoogleOAuthClient,
} from '../domain/services/google-oauth.client.js';

import type {
  IGoogleAuthService,
} from '../application/services/google-auth.service.js';

import type {
  Request,
} from 'express';
import { GoogleEmailNotVerifiedError } from '../application/errors/google-email-not-verified.error.js';
import { ForbiddenException } from '@nestjs/common';

type AuthenticatedRequest = Request & {
  user: User;
  token: string;
};

describe('IAM AuthController', () => {
  // =========================================================
  // LOGOUT MOCK
  // =========================================================

  const logoutMock =
    jest.fn<
      (token: string) => Promise<void>
    >();

  const logoutService =
    {
      logout: logoutMock,
    } as unknown as ILogoutService;

  // =========================================================
  // FORGOT PASSWORD MOCK
  // =========================================================

  const requestResetMock =
    jest.fn<
      (
        params: {
          email: string;
          ipAddress?: string | null;
          userAgent?: string | null;
        },
      ) => ReturnType<
        IForgotPasswordService['requestReset']
      >
    >();

  const forgotPasswordService =
    {
      requestReset: requestResetMock,
    } as unknown as IForgotPasswordService;

  // =========================================================
  // RESET PASSWORD MOCK
  // =========================================================

  const resetPasswordMock =
    jest.fn<
      (
        params: {
          token: string;
          newPassword: string;
          ipAddress?: string | null;
          userAgent?: string | null;
        },
      ) => Promise<void>
    >();

  const resetPasswordService =
    {
      resetPassword:
        resetPasswordMock,
    } as unknown as IResetPasswordService;

  // =========================================================
  // GOOGLE OAUTH CLIENT MOCK
  // =========================================================

  const getAuthorizationUrlMock =
    jest.fn<
      IGoogleOAuthClient['getAuthorizationUrl']
    >();

  const exchangeCodeForProfileMock =
    jest.fn<
      IGoogleOAuthClient['exchangeCodeForProfile']
    >();

  const googleOAuthClient =
    {
      getAuthorizationUrl:
        getAuthorizationUrlMock,

      exchangeCodeForProfile:
        exchangeCodeForProfileMock,
    } as unknown as IGoogleOAuthClient;

  // =========================================================
  // GOOGLE AUTH SERVICE MOCK
  // =========================================================

  const loginWithCodeMock =
    jest.fn<
      IGoogleAuthService['loginWithCode']
    >();

  const googleAuthService =
    {
      loginWithCode:
        loginWithCodeMock,
    } as unknown as IGoogleAuthService;

  // =========================================================
  // LOGIN
  // =========================================================

  it(
    'should login successfully',
    async () => {
      const user =
        User.createNew({
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
            ipAddress?: string | null;
            userAgent?: string | null;
          }) => Promise<{
            user: User;
            token: string;
          }>
        >();

      loginMock.mockResolvedValue({
        user,
        token: 'raw-session-token',
      });

      const authService =
        {
          login: loginMock,
        } as unknown as AuthService;

      const revokeSessionService =
        {
          revokeSession:
            jest.fn<
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
          forgotPasswordService,
          resetPasswordService,
          googleOAuthClient,
          googleAuthService,
        );

      const request = {
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue(
          'PostmanRuntime/Test',
        ),
      } as unknown as Request;

      const result =
        await controller.login(
          {
            email: 'abdul@example.com',
            password: 'StrongPassword123!',
          },
          request,
        );

      expect(
        loginMock,
      ).toHaveBeenCalledWith({
        email: 'abdul@example.com',
        password: 'StrongPassword123!',
        ipAddress: '127.0.0.1',
        userAgent: 'PostmanRuntime/Test',
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
    },
  );

  // =========================================================
  // INVALID LOGIN
  // =========================================================

  it(
    'should throw UnauthorizedException when credentials are invalid',
    async () => {
      const loginMock =
        jest.fn<
          (params: {
            email: string;
            password: string;
            ipAddress?: string | null;
            userAgent?: string | null;
          }) => Promise<{
            user: User;
            token: string;
          }>
        >();

      loginMock.mockRejectedValue(
        new InvalidCredentialsError(),
      );

      const authService =
        {
          login: loginMock,
        } as unknown as AuthService;

      const revokeSessionService =
        {
          revokeSession:
            jest.fn<
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
          forgotPasswordService,
          resetPasswordService,
          googleOAuthClient,
          googleAuthService,
        );

      const request = {
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue(
          'PostmanRuntime/Test',
        ),
      } as unknown as Request;

      await expect(
        controller.login(
          {
            email: 'abdul@example.com',
            password: 'WrongPassword123!',
          },
          request,
        ),
      ).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials',
      });
    },
  );

  // =========================================================
  // REVOKE SESSION
  // =========================================================

  it(
    'should revoke a session successfully',
    async () => {
      const user =
        User.createNew({
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

      const revokeSessionService =
        {
          revokeSession:
            revokeSessionMock,
        } as unknown as IRevokeSessionService;

      const authService =
        {
          login: jest.fn(),
        } as unknown as AuthService;

      const controller =
        new AuthController(
          authService,
          logoutService,
          revokeSessionService,
          forgotPasswordService,
          resetPasswordService,
          googleOAuthClient,
          googleAuthService,
        );

      const request =
        {
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
        message:
          'Session revoked successfully',
      });
    },
  );

  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  it(
    'should request password reset',
    async () => {
      requestResetMock.mockResolvedValue(
        null,
      );

      const authService =
        {
          login: jest.fn(),
        } as unknown as AuthService;

      const revokeSessionService =
        {
          revokeSession:
            jest.fn<
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
          forgotPasswordService,
          resetPasswordService,
          googleOAuthClient,
          googleAuthService,
        );

      const request = {
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue(
          'PostmanRuntime/Test',
        ),
      } as unknown as Request;

      const result =
        await controller.forgotPassword(
          {
            email:
              'unknown@example.com',
          },
          request,
        );

      expect(
        requestResetMock,
      ).toHaveBeenCalledWith({
        email:
          'unknown@example.com',
        ipAddress:
          '127.0.0.1',
        userAgent:
          'PostmanRuntime/Test',
      });

      expect(result).toEqual({
        message:
          'If an account exists with this email, a password reset link has been sent.',
      });
    },
  );

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  it(
    'should reset password successfully',
    async () => {
      resetPasswordMock.mockResolvedValue();

      const authService =
        {
          login: jest.fn(),
        } as unknown as AuthService;

      const revokeSessionService =
        {
          revokeSession:
            jest.fn<
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
          forgotPasswordService,
          resetPasswordService,
          googleOAuthClient,
          googleAuthService,
        );

      const request = {
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue(
          'PostmanRuntime/Test',
        ),
      } as unknown as Request;

      const result =
        await controller.resetPassword(
          {
            token: 'raw-reset-token',
            newPassword: 'NewPassword123!',
          },
          request,
        );

      expect(
        resetPasswordMock,
      ).toHaveBeenCalledWith({
        token: 'raw-reset-token',
        newPassword: 'NewPassword123!',
        ipAddress: '127.0.0.1',
        userAgent:
          'PostmanRuntime/Test',
      });

      expect(result).toEqual({
        message:
          'Password has been reset successfully.',
      });
    },
  );

  // =========================================================
  // GOOGLE LOGIN URL
  // =========================================================

  it(
    'should return Google authorization URL',
    async () => {
      const authorizationUrl =
        'https://accounts.google.com/o/oauth2/v2/auth?...';

      getAuthorizationUrlMock.mockReturnValue(
        authorizationUrl,
      );

      const authService =
        {
          login: jest.fn(),
        } as unknown as AuthService;

      const revokeSessionService =
        {
          revokeSession:
            jest.fn<
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
          forgotPasswordService,
          resetPasswordService,
          googleOAuthClient,
          googleAuthService,
        );

      const result =
        await controller.googleLogin();

      expect(
        getAuthorizationUrlMock,
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        url: authorizationUrl,
      });
    },
  );

  // =========================================================
  // GOOGLE CALLBACK
  // =========================================================

  it(
    'should login with Google callback',
    async () => {
      const user =
        User.createNew({
          id: 'user-1',
          email: 'abdul@gmail.com',
          firstName: 'Abdul',
          lastName: 'Halim',
        });

      loginWithCodeMock.mockResolvedValue({
        user,
        token: 'google-session-token',
      });

      const authService =
        {
          login: jest.fn(),
        } as unknown as AuthService;

      const revokeSessionService =
        {
          revokeSession:
            jest.fn<
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
          forgotPasswordService,
          resetPasswordService,
          googleOAuthClient,
          googleAuthService,
        );

      const request = {
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue(
          'PostmanRuntime/Test',
        ),
      } as unknown as Request;

      const result =
        await controller.googleCallback(
          'google-code',
          request,
        );

      expect(
        loginWithCodeMock,
      ).toHaveBeenCalledWith({
        code: 'google-code',
        ipAddress: '127.0.0.1',
        userAgent:
          'PostmanRuntime/Test',
      });

      expect(result).toEqual({
  user: {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.status,
    emailVerifiedAt: user.emailVerifiedAt,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  },
  token: 'google-session-token',
});
    },
  );
 it(
  'should return 403 when Google email is not verified',
  async () => {
    loginWithCodeMock.mockRejectedValue(
      new GoogleEmailNotVerifiedError(),
    );

    const authService = {
      login: jest.fn(),
    } as unknown as AuthService;

    const revokeSessionService = {
      revokeSession:
        jest.fn<
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
        forgotPasswordService,
        resetPasswordService,
        googleOAuthClient,
        googleAuthService,
      );

    const request = {
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue(
        'PostmanRuntime/Test',
      ),
    } as unknown as Request;

    await expect(
      controller.googleCallback(
        'google-code',
        request,
      ),
    ).rejects.toMatchObject({
      status: 403,
      message:
        'Google email is not verified',
    });
  },
);
  
});