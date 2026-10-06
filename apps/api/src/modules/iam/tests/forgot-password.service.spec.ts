import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { User } from '../domain/entities/user.entity.js';

import {
  PasswordReset,
} from '../domain/entities/password-reset.entity.js';

import {
  UserService,
} from '../application/services/user.service.js';

import {
  ForgotPasswordService,
} from '../application/services/forgot-password.service.impl.js';

import type {
  IPasswordResetRepository,
} from '../domain/repositories/password-reset.repository.js';

import type {
  ISessionTokenService,
} from '../application/services/session-token.service.js';

import type {
  IEmailService,
} from '../application/services/email.service.js';

import type {
  IAuthEventService,
} from '../application/services/auth-event.service.js';

type MockUserService = {
  findByEmail: jest.Mock<
    (email: string) => Promise<User | null>
  >;
};

type MockPasswordResetRepository = {
  findActiveByUserId: jest.Mock<
    (
      userId: string,
    ) => Promise<PasswordReset | null>
  >;

  create: jest.Mock<
    (
      passwordReset: PasswordReset,
    ) => Promise<PasswordReset>
  >;

  update: jest.Mock<
    (
      passwordReset: PasswordReset,
    ) => Promise<PasswordReset>
  >;
};

type MockSessionTokenService = {
  generate: jest.Mock<
    () => string
  >;

  hash: jest.Mock<
    (token: string) => string
  >;
};

describe(
  'ForgotPasswordService',
  () => {
    let service: ForgotPasswordService;

    let userService: MockUserService;

    let passwordResetRepository:
      MockPasswordResetRepository;

    let sessionTokenService:
      MockSessionTokenService;

    let emailService: IEmailService;

    let recordAuthEventMock:
      jest.MockedFunction<
        IAuthEventService['record']
      >;

    let authEventService:
      IAuthEventService;

    beforeEach(() => {
      userService = {
        findByEmail:
          jest.fn<
            (
              email: string,
            ) => Promise<User | null>
          >(),
      };

      passwordResetRepository = {
        findActiveByUserId:
          jest.fn<
            (
              userId: string,
            ) => Promise<
              PasswordReset | null
            >
          >(),

        create:
          jest.fn<
            (
              passwordReset: PasswordReset,
            ) => Promise<PasswordReset>
          >(),

        update:
          jest.fn<
            (
              passwordReset: PasswordReset,
            ) => Promise<PasswordReset>
          >(),
      };

      sessionTokenService = {
        generate:
          jest.fn<
            () => string
          >(),

        hash:
          jest.fn<
            (
              token: string,
            ) => string
          >(),
      };

      emailService = {
        send: jest.fn<
          IEmailService['send']
        >(),
      };

      recordAuthEventMock =
        jest.fn<
          IAuthEventService['record']
        >();

      recordAuthEventMock.mockResolvedValue(
        {} as Awaited<
          ReturnType<
            IAuthEventService['record']
          >
        >,
      );

      authEventService = {
        record:
          recordAuthEventMock,
      };

      service =
        new ForgotPasswordService(
          userService as unknown as UserService,

          passwordResetRepository as unknown as IPasswordResetRepository,

          sessionTokenService as unknown as ISessionTokenService,

          emailService,

          authEventService,
        );
    });

    it(
      'should return null when user does not exist',
      async () => {
        userService.findByEmail
          .mockResolvedValue(null);

        const result =
          await service.requestReset({
            email:
              'unknown@example.com',
          });

        expect(result)
          .toBeNull();

        expect(
          userService.findByEmail,
        ).toHaveBeenCalledWith(
          'unknown@example.com',
        );

        expect(
          passwordResetRepository
            .findActiveByUserId,
        ).not.toHaveBeenCalled();

        expect(
          passwordResetRepository.create,
        ).not.toHaveBeenCalled();

        expect(
          emailService.send,
        ).not.toHaveBeenCalled();

        expect(
          recordAuthEventMock,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      'should create a password reset for an existing user',
      async () => {
        const user =
          User.createNew({
            id: 'user-1',
            email:
              'test@example.com',
            firstName: 'Test',
            lastName: 'User',
          });

        userService.findByEmail
          .mockResolvedValue(user);

        passwordResetRepository
          .findActiveByUserId
          .mockResolvedValue(null);

        sessionTokenService
          .generate
          .mockReturnValue(
            'raw-reset-token',
          );

        sessionTokenService
          .hash
          .mockReturnValue(
            'hashed-reset-token',
          );

        passwordResetRepository
          .create
          .mockImplementation(
            async (
              reset: PasswordReset,
            ) => reset,
          );

        const result =
          await service.requestReset({
            email: user.email,
          });

        expect(result)
          .toBeInstanceOf(
            PasswordReset,
          );

        expect(result?.userId)
          .toBe(user.id);

        expect(result?.tokenHash)
          .toBe(
            'hashed-reset-token',
          );

        expect(result?.isValid())
          .toBe(true);

        expect(
          sessionTokenService.generate,
        ).toHaveBeenCalledTimes(1);

        expect(
          sessionTokenService.hash,
        ).toHaveBeenCalledWith(
          'raw-reset-token',
        );

        expect(
          passwordResetRepository.create,
        ).toHaveBeenCalledTimes(1);

        expect(
          emailService.send,
        ).toHaveBeenCalledTimes(1);

        expect(
          recordAuthEventMock,
        ).toHaveBeenCalledWith({
          userId: user.id,
          type:
            'PASSWORD_RESET_REQUESTED',
          ipAddress: undefined,
          userAgent: undefined,
        });
      },
    );

    it(
      'should revoke the existing active reset before creating a new one',
      async () => {
        const user =
          User.createNew({
            id: 'user-1',
            email:
              'test@example.com',
            firstName: 'Test',
            lastName: 'User',
          });

        const existingReset =
          PasswordReset.createNew({
            id: 'reset-1',
            userId: user.id,
            tokenHash:
              'old-token',
            expiresAt:
              new Date(
                Date.now() +
                  10 * 60 * 1000,
              ),
          });

        userService.findByEmail
          .mockResolvedValue(user);

        passwordResetRepository
          .findActiveByUserId
          .mockResolvedValue(
            existingReset,
          );

        passwordResetRepository
          .update
          .mockImplementation(
            async (
              reset: PasswordReset,
            ) => reset,
          );

        sessionTokenService
          .generate
          .mockReturnValue(
            'new-reset-token',
          );

        sessionTokenService
          .hash
          .mockReturnValue(
            'new-hashed-token',
          );

        passwordResetRepository
          .create
          .mockImplementation(
            async (
              reset: PasswordReset,
            ) => reset,
          );

        const result =
          await service.requestReset({
            email: user.email,
          });

        expect(
          existingReset.isRevoked(),
        ).toBe(true);

        expect(
          passwordResetRepository.update,
        ).toHaveBeenCalledWith(
          existingReset,
        );

        expect(
          passwordResetRepository.create,
        ).toHaveBeenCalledTimes(1);

        expect(result?.tokenHash)
          .toBe(
            'new-hashed-token',
          );

        expect(
          recordAuthEventMock,
        ).toHaveBeenCalledWith({
          userId: user.id,
          type:
            'PASSWORD_RESET_REQUESTED',
          ipAddress: undefined,
          userAgent: undefined,
        });
      },
    );

    it(
      'should create a reset that expires in 15 minutes',
      async () => {
        const user =
          User.createNew({
            id: 'user-1',
            email:
              'test@example.com',
            firstName: 'Test',
            lastName: 'User',
          });

        userService.findByEmail
          .mockResolvedValue(user);

        passwordResetRepository
          .findActiveByUserId
          .mockResolvedValue(null);

        sessionTokenService
          .generate
          .mockReturnValue(
            'raw-token',
          );

        sessionTokenService
          .hash
          .mockReturnValue(
            'hashed-token',
          );

        passwordResetRepository
          .create
          .mockImplementation(
            async (
              reset: PasswordReset,
            ) => reset,
          );

        const before =
          Date.now();

        const result =
          await service.requestReset({
            email: user.email,
          });

        const after =
          Date.now();

        expect(result)
          .not.toBeNull();

        const expiresAt =
          result!.expiresAt.getTime();

        const minExpected =
          before +
          15 * 60 * 1000;

        const maxExpected =
          after +
          15 * 60 * 1000;

        expect(expiresAt)
          .toBeGreaterThanOrEqual(
            minExpected,
          );

        expect(expiresAt)
          .toBeLessThanOrEqual(
            maxExpected,
          );

        expect(
          recordAuthEventMock,
        ).toHaveBeenCalledWith({
          userId: user.id,
          type:
            'PASSWORD_RESET_REQUESTED',
          ipAddress: undefined,
          userAgent: undefined,
        });
      },
    );
  },
);