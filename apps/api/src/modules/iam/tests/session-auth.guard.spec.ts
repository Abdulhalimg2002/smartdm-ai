
import {
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
} from '@jest/globals';

import {
  SessionAuthGuard,
} from '../presentation/guards/session-auth.guard.js';

import {
  InvalidSessionError,
} from '../application/errors/invalid-session.error.js';

import type {
  ISessionValidationService,
} from '../application/services/session-validation.service.js';

import {
  Session,
} from '../domain/entities/session.entity.js';

import {
  User,
} from '../domain/entities/user.entity.js';

describe('SessionAuthGuard', () => {
  const mockUser = User.createNew({
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  });

  const mockSession = Session.createNew({
    id: 'session-1',
    userId: mockUser.id,
    tokenHash: 'hashed-token',
    expiresAt: new Date(Date.now() + 60_000),
  });

  const sessionValidationService: {
    validate: jest.MockedFunction<
      ISessionValidationService['validate']
    >;
  } = {
    validate: jest.fn(),
  };

  const guard = new SessionAuthGuard(
    sessionValidationService,
  );

  const createExecutionContext = (
    token?: string,
  ): ExecutionContext => {
    const request = {
      cookies: token
        ? {
            smartdm_session: token,
          }
        : {},
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow request with valid session cookie', async () => {
    sessionValidationService.validate.mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });

    const context = createExecutionContext('valid-token');

    const result = await guard.canActivate(context);

    const request = context
      .switchToHttp()
      .getRequest<{
        user: User;
        session: Session;
        token: string;
      }>();

    expect(result).toBe(true);

    expect(
      sessionValidationService.validate,
    ).toHaveBeenCalledWith('valid-token');

    expect(request.user).toBe(mockUser);
    expect(request.session).toBe(mockSession);
    expect(request.token).toBe('valid-token');
  });

  it('should reject request when session cookie is missing', async () => {
    const context = createExecutionContext();

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(UnauthorizedException);

    expect(
      sessionValidationService.validate,
    ).not.toHaveBeenCalled();
  });

  it('should reject request when session cookie is not a string', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            smartdm_session: ['invalid-token'],
          },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(UnauthorizedException);

    expect(
      sessionValidationService.validate,
    ).not.toHaveBeenCalled();
  });

  it('should reject request when session is invalid', async () => {
    sessionValidationService.validate.mockRejectedValue(
      new InvalidSessionError(),
    );

    const context = createExecutionContext('invalid-token');

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(UnauthorizedException);

    expect(
      sessionValidationService.validate,
    ).toHaveBeenCalledWith('invalid-token');
  });
});
