import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { randomUUID } from 'node:crypto';

import {
  PrismaPasswordResetRepository,
} from '../infrastructure/persistence/repositories/prisma-password-reset.repository.js';

import {
  PrismaUserRepository,
} from '../infrastructure/persistence/repositories/prisma-user.repository.js';

import {
  PasswordReset,
} from '../domain/entities/password-reset.entity.js';

import {
  User,
} from '../domain/entities/user.entity.js';

describe(
  'PasswordReset Repository Integration',
  () => {
    const repository =
      new PrismaPasswordResetRepository();

    const userRepository =
      new PrismaUserRepository();

    const createTestUser = async (): Promise<User> => {
      const user = User.createNew({
        id: randomUUID(),
        email: `reset-${randomUUID()}@test.com`,
        firstName: 'Reset',
        lastName: 'Test',
      });

      await userRepository.create(user);

      return user;
    };

    it(
      'should create and find a password reset',
      async () => {
        const user =
          await createTestUser();

        const reset =
          PasswordReset.createNew({
            id: randomUUID(),
            userId: user.id,
            tokenHash:
              `test-token-${randomUUID()}`,
            expiresAt:
              new Date(
                Date.now() +
                  15 * 60 * 1000,
              ),
          });

        const created =
          await repository.create(reset);

        expect(created.id)
          .toBe(reset.id);

        expect(created.userId)
          .toBe(user.id);

        const found =
          await repository.findById(
            reset.id,
          );

        expect(found).not.toBeNull();

        expect(found?.id)
          .toBe(reset.id);

        expect(found?.tokenHash)
          .toBe(reset.tokenHash);
      },
    );

    it(
      'should find a password reset by token hash',
      async () => {
        const user =
          await createTestUser();

        const reset =
          PasswordReset.createNew({
            id: randomUUID(),
            userId: user.id,
            tokenHash:
              `token-${randomUUID()}`,
            expiresAt:
              new Date(
                Date.now() +
                  15 * 60 * 1000,
              ),
          });

        await repository.create(reset);

        const found =
          await repository.findByTokenHash(
            reset.tokenHash,
          );

        expect(found).not.toBeNull();

        expect(found?.id)
          .toBe(reset.id);
      },
    );

    it(
      'should find an active password reset by user id',
      async () => {
        const user =
          await createTestUser();

        const reset =
          PasswordReset.createNew({
            id: randomUUID(),
            userId: user.id,
            tokenHash:
              `active-${randomUUID()}`,
            expiresAt:
              new Date(
                Date.now() +
                  15 * 60 * 1000,
              ),
          });

        await repository.create(reset);

        const found =
          await repository.findActiveByUserId(
            user.id,
          );

        expect(found).not.toBeNull();

        expect(found?.id)
          .toBe(reset.id);

        expect(found?.isValid())
          .toBe(true);
      },
    );

    it(
      'should update a password reset',
      async () => {
        const user =
          await createTestUser();

        const reset =
          PasswordReset.createNew({
            id: randomUUID(),
            userId: user.id,
            tokenHash:
              `update-${randomUUID()}`,
            expiresAt:
              new Date(
                Date.now() +
                  15 * 60 * 1000,
              ),
          });

        await repository.create(reset);

        reset.use();

        const updated =
          await repository.update(
            reset,
          );

        expect(updated.usedAt)
          .not.toBeNull();

        expect(updated.isUsed())
          .toBe(true);

        expect(updated.isValid())
          .toBe(false);
      },
    );
  },
);