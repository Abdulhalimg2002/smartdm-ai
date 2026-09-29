
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
    authorization?: string,
  ): ExecutionContext => {
    const request = {
      headers: {
        authorization,
      },
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

  it('should allow request with valid token', async () => {
    sessionValidationService.validate.mockResolvedValue({
      user: mockUser,
      session: mockSession,
    });

    const context =
      createExecutionContext(
        'Bearer valid-token',
      );

    const result =
      await guard.canActivate(context);

    const request =
      context
        .switchToHttp()
        .getRequest();

    expect(result).toBe(true);

    expect(
      sessionValidationService.validate,
    ).toHaveBeenCalledWith(
      'valid-token',
    );

    expect(request.user).toBe(mockUser);
    expect(request.session).toBe(mockSession);
  });

  it('should reject request when Authorization header is missing', async () => {
    const context =
      createExecutionContext();

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(
      UnauthorizedException,
    );

    expect(
      sessionValidationService.validate,
    ).not.toHaveBeenCalled();
  });

  it('should reject request when scheme is not Bearer', async () => {
    const context =
      createExecutionContext(
        'Basic some-token',
      );

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(
      UnauthorizedException,
    );

    expect(
      sessionValidationService.validate,
    ).not.toHaveBeenCalled();
  });

  it('should reject request when token is missing', async () => {
    const context =
      createExecutionContext(
        'Bearer',
      );

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(
      UnauthorizedException,
    );

    expect(
      sessionValidationService.validate,
    ).not.toHaveBeenCalled();
  });

  it('should reject request when session is invalid', async () => {
    sessionValidationService.validate.mockRejectedValue(
      new InvalidSessionError(),
    );

    const context =
      createExecutionContext(
        'Bearer invalid-token',
      );

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(
      UnauthorizedException,
    );

    expect(
      sessionValidationService.validate,
    ).toHaveBeenCalledWith(
      'invalid-token',
    );
  });
});
