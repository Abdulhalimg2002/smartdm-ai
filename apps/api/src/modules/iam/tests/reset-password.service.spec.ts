import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import {
  PasswordReset,
} from '../domain/entities/password-reset.entity.js';

import {
  UserCredential,
} from '../domain/entities/user-credential.entity.js';

import {
  Session,
} from '../domain/entities/session.entity.js';

import {
  InvalidPasswordResetError,
} from '../application/errors/invalid-password-reset.error.js';

import {
  ResetPasswordService,
} from '../application/services/reset-password.service.impl.js';

describe('ResetPasswordService', () => {
  const userId =
    'user-test-id';

  const resetId =
    'reset-test-id';

  const rawToken =
    'raw-reset-token';

  const passwordReset =
    PasswordReset.createNew({
      id: resetId,
      userId,
      tokenHash:
        'c7b8a3f1c8c1f7e5b3d9f0a1e2c4d6f8',
      expiresAt:
        new Date(
          Date.now() +
            15 * 60 * 1000,
        ),
    });

  const credentials =
    UserCredential.createNew({
      id: 'credential-test-id',
      userId,
      passwordHash:
        'old-password-hash',
    });

  function createService() {
    const passwordResetRepository = {
      findById:
        jest.fn<
          (
            id: string,
          ) => Promise<
            PasswordReset | null
          >
        >(),

      findByTokenHash:
        jest.fn<
          (
            tokenHash: string,
          ) => Promise<
            PasswordReset | null
          >
        >(),

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
            passwordReset:
              PasswordReset,
          ) => Promise<PasswordReset>
        >(),

      update:
        jest.fn<
          (
            passwordReset:
              PasswordReset,
          ) => Promise<PasswordReset>
        >(),
    };

    const credentialRepository = {
      findByUserId:
        jest.fn<
          (
            userId: string,
          ) => Promise<
            UserCredential | null
          >
        >(),

      create:
        jest.fn<
          (
            credentials:
              UserCredential,
          ) => Promise<UserCredential>
        >(),

      update:
        jest.fn<
          (
            credentials:
              UserCredential,
          ) => Promise<UserCredential>
        >(),
    };

    const passwordHasher = {
      hash:
        jest.fn<
          (
            password: string,
          ) => Promise<string>
        >(),

      compare:
        jest.fn<
          (
            password: string,
            passwordHash: string,
          ) => Promise<boolean>
        >(),
    };

    const sessionRepository = {
      findById:
        jest.fn<
          (
            id: string,
          ) => Promise<Session | null>
        >(),

      findByTokenHash:
        jest.fn<
          (
            tokenHash: string,
          ) => Promise<Session | null>
        >(),

      create:
        jest.fn<
          (
            session: Session,
          ) => Promise<Session>
        >(),

      update:
        jest.fn<
          (
            session: Session,
          ) => Promise<Session>
        >(),

      revokeAllByUserId:
        jest.fn<
          (
            userId: string,
          ) => Promise<void>
        >(),
    };

    const service =
      new ResetPasswordService(
        passwordResetRepository,
        credentialRepository,
        passwordHasher,
        sessionRepository,
      );

    return {
      service,
      passwordResetRepository,
      credentialRepository,
      passwordHasher,
      sessionRepository,
    };
  }

  it(
    'should reset password successfully',
    async () => {
      const {
        service,
        passwordResetRepository,
        credentialRepository,
        passwordHasher,
        sessionRepository,
      } = createService();

      passwordResetRepository
        .findByTokenHash
        .mockResolvedValue(
          passwordReset,
        );

      credentialRepository
        .findByUserId
        .mockResolvedValue(
          credentials,
        );

      passwordHasher.hash
        .mockResolvedValue(
          'new-password-hash',
        );

      await service.resetPassword({
        token: rawToken,
        newPassword:
          'NewPassword123!',
      });

      expect(
        passwordHasher.hash,
      ).toHaveBeenCalledWith(
        'NewPassword123!',
      );

      expect(
        credentialRepository.update,
      ).toHaveBeenCalledWith(
        credentials,
      );

      expect(
        credentials.passwordHash,
      ).toBe(
        'new-password-hash',
      );

      expect(
        credentials.passwordChangedAt,
      ).not.toBeNull();

      expect(
        passwordReset.usedAt,
      ).not.toBeNull();

      expect(
        passwordResetRepository.update,
      ).toHaveBeenCalledWith(
        passwordReset,
      );

      expect(
        sessionRepository
          .revokeAllByUserId,
      ).toHaveBeenCalledWith(
        passwordReset.userId,
      );
    },
  );

  it(
    'should throw when token does not exist',
    async () => {
      const {
        service,
        passwordResetRepository,
      } = createService();

      passwordResetRepository
        .findByTokenHash
        .mockResolvedValue(null);

      await expect(
        service.resetPassword({
          token: rawToken,
          newPassword:
            'NewPassword123!',
        }),
      ).rejects.toBeInstanceOf(
        InvalidPasswordResetError,
      );
    },
  );

  it(
    'should throw when token is expired',
    async () => {
      const {
        service,
        passwordResetRepository,
      } = createService();

      const expiredReset =
        PasswordReset.createNew({
          id: resetId,
          userId,
          tokenHash:
            'expired-token-hash',
          expiresAt:
            new Date(
              Date.now() -
                60 * 1000,
            ),
        });

      passwordResetRepository
        .findByTokenHash
        .mockResolvedValue(
          expiredReset,
        );

      await expect(
        service.resetPassword({
          token: rawToken,
          newPassword:
            'NewPassword123!',
        }),
      ).rejects.toBeInstanceOf(
        InvalidPasswordResetError,
      );
    },
  );

  it(
    'should throw when token is already used',
    async () => {
      const {
        service,
        passwordResetRepository,
      } = createService();

      const usedReset =
        PasswordReset.createNew({
          id: resetId,
          userId,
          tokenHash:
            'used-token-hash',
          expiresAt:
            new Date(
              Date.now() +
                15 * 60 * 1000,
            ),
        });

      usedReset.use();

      passwordResetRepository
        .findByTokenHash
        .mockResolvedValue(
          usedReset,
        );

      await expect(
        service.resetPassword({
          token: rawToken,
          newPassword:
            'NewPassword123!',
        }),
      ).rejects.toBeInstanceOf(
        InvalidPasswordResetError,
      );
    },
  );

  it(
    'should throw when token is revoked',
    async () => {
      const {
        service,
        passwordResetRepository,
      } = createService();

      const revokedReset =
        PasswordReset.createNew({
          id: resetId,
          userId,
          tokenHash:
            'revoked-token-hash',
          expiresAt:
            new Date(
              Date.now() +
                15 * 60 * 1000,
            ),
        });

      revokedReset.revoke();

      passwordResetRepository
        .findByTokenHash
        .mockResolvedValue(
          revokedReset,
        );

      await expect(
        service.resetPassword({
          token: rawToken,
          newPassword:
            'NewPassword123!',
        }),
      ).rejects.toBeInstanceOf(
        InvalidPasswordResetError,
      );
    },
  );

  it(
    'should throw when credentials do not exist',
    async () => {
      const {
        service,
        passwordResetRepository,
        credentialRepository,
      } = createService();

      passwordResetRepository
        .findByTokenHash
        .mockResolvedValue(
          passwordReset,
        );

      credentialRepository
        .findByUserId
        .mockResolvedValue(null);

      await expect(
        service.resetPassword({
          token: rawToken,
          newPassword:
            'NewPassword123!',
        }),
      ).rejects.toBeInstanceOf(
        InvalidPasswordResetError,
      );
    },
  );
});