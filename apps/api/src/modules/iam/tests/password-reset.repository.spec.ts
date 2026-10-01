import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { randomUUID } from 'node:crypto';

import {
  PasswordReset,
} from '../domain/entities/password-reset.entity.js';

type PasswordResetRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const mockPasswordReset = {
  where: jest.fn<
    (
      args: {
        id?: string;
        tokenHash?: string;
        userId?: string;
      },
    ) => {
      first: jest.Mock<
        () => Promise<PasswordResetRecord | null>
      >;
      update: jest.Mock<
        () => Promise<PasswordResetRecord | null>
      >;
    }
  >(),

  create: jest.fn<
    (
      args: PasswordResetRecord,
    ) => Promise<PasswordResetRecord>
  >(),
};

const mockDb = {
  orm: {
    public: {
      PasswordReset: mockPasswordReset,
    },
  },
};

jest.unstable_mockModule(
  '../../../prisma/db.js',
  () => ({
    db: mockDb,
  }),
);

const {
  PrismaPasswordResetRepository,
} = await import(
  '../infrastructure/persistence/repositories/prisma-password-reset.repository.js'
);

describe(
  'PrismaPasswordResetRepository',
  () => {
    const repository =
      new PrismaPasswordResetRepository();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it(
      'should return a password reset by id',
      async () => {
        const resetId = randomUUID();

        const record: PasswordResetRecord = {
          id: resetId,
          userId: randomUUID(),
          tokenHash: 'hashed-token',
          expiresAt:
            new Date(
              Date.now() + 15 * 60 * 1000,
            ),
          usedAt: null,
          revokedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const first =
          jest.fn<
            () => Promise<
              PasswordResetRecord | null
            >
          >();

        first.mockResolvedValue(record);

        mockPasswordReset.where.mockReturnValue({
          first,
          update:
            jest.fn(),
        });

        const result =
          await repository.findById(
            resetId,
          );

        expect(result).not.toBeNull();

        expect(result?.id)
          .toBe(resetId);

        expect(result?.tokenHash)
          .toBe('hashed-token');

        expect(
          mockPasswordReset.where,
        ).toHaveBeenCalledWith({
          id: resetId,
        });
      },
    );

    it(
      'should return null when password reset does not exist',
      async () => {
        const resetId = randomUUID();

        const first =
          jest.fn<
            () => Promise<
              PasswordResetRecord | null
            >
          >();

        first.mockResolvedValue(null);

        mockPasswordReset.where.mockReturnValue({
          first,
          update:
            jest.fn(),
        });

        const result =
          await repository.findById(
            resetId,
          );

        expect(result).toBeNull();

        expect(
          mockPasswordReset.where,
        ).toHaveBeenCalledWith({
          id: resetId,
        });
      },
    );

    it(
      'should find a password reset by token hash',
      async () => {
        const tokenHash =
          'hashed-reset-token';

        const record: PasswordResetRecord = {
          id: randomUUID(),
          userId: randomUUID(),
          tokenHash,
          expiresAt:
            new Date(
              Date.now() + 15 * 60 * 1000,
            ),
          usedAt: null,
          revokedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const first =
          jest.fn<
            () => Promise<
              PasswordResetRecord | null
            >
          >();

        first.mockResolvedValue(record);

        mockPasswordReset.where.mockReturnValue({
          first,
          update:
            jest.fn(),
        });

        const result =
          await repository.findByTokenHash(
            tokenHash,
          );

        expect(result).not.toBeNull();

        expect(result?.tokenHash)
          .toBe(tokenHash);

        expect(
          mockPasswordReset.where,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'should return null when token hash does not exist',
      async () => {
        const first =
          jest.fn<
            () => Promise<
              PasswordResetRecord | null
            >
          >();

        first.mockResolvedValue(null);

        mockPasswordReset.where.mockReturnValue({
          first,
          update:
            jest.fn(),
        });

        const result =
          await repository.findByTokenHash(
            'unknown-token',
          );

        expect(result).toBeNull();
      },
    );

    it(
      'should create a password reset',
      async () => {
        const reset =
          PasswordReset.createNew({
            id: randomUUID(),
            userId: randomUUID(),
            tokenHash:
              'hashed-token',
            expiresAt:
              new Date(
                Date.now() + 15 * 60 * 1000,
              ),
          });

        const record: PasswordResetRecord = {
          id: reset.id,
          userId: reset.userId,
          tokenHash: reset.tokenHash,
          expiresAt:
            reset.expiresAt,
          usedAt: null,
          revokedAt: null,
          createdAt:
            reset.createdAt,
          updatedAt:
            reset.updatedAt,
        };

        mockPasswordReset.create.mockResolvedValue(
          record,
        );

        const result =
          await repository.create(
            reset,
          );

        expect(result.id)
          .toBe(reset.id);

        expect(result.userId)
          .toBe(reset.userId);

        expect(result.tokenHash)
          .toBe(reset.tokenHash);

        expect(
          mockPasswordReset.create,
        ).toHaveBeenCalledTimes(1);

        expect(
          mockPasswordReset.create.mock
            .calls[0][0],
        ).toMatchObject({
          id: reset.id,
          userId: reset.userId,
          tokenHash: reset.tokenHash,
        });
      },
    );

    it(
      'should update a password reset',
      async () => {
        const reset =
          PasswordReset.createNew({
            id: randomUUID(),
            userId: randomUUID(),
            tokenHash:
              'hashed-token',
            expiresAt:
              new Date(
                Date.now() + 15 * 60 * 1000,
              ),
          });

        reset.use();

        const record: PasswordResetRecord = {
          id: reset.id,
          userId: reset.userId,
          tokenHash: reset.tokenHash,
          expiresAt:
            reset.expiresAt,
          usedAt:
            reset.usedAt,
          revokedAt:
            reset.revokedAt,
          createdAt:
            reset.createdAt,
          updatedAt:
            reset.updatedAt,
        };

        const update =
          jest.fn<
            () => Promise<
              PasswordResetRecord | null
            >
          >();

        update.mockResolvedValue(record);

        mockPasswordReset.where.mockReturnValue({
          first:
            jest.fn(),
          update,
        });

        const result =
          await repository.update(
            reset,
          );

        expect(result.id)
          .toBe(reset.id);

        expect(result.usedAt)
          .not.toBeNull();

        expect(result.isUsed())
          .toBe(true);

        expect(
          mockPasswordReset.where,
        ).toHaveBeenCalledWith({
          id: reset.id,
        });
      },
    );

    it(
      'should throw when updating a password reset that does not exist',
      async () => {
        const reset =
          PasswordReset.createNew({
            id: randomUUID(),
            userId: randomUUID(),
            tokenHash:
              'hashed-token',
            expiresAt:
              new Date(
                Date.now() + 15 * 60 * 1000,
              ),
          });

        const update =
          jest.fn<
            () => Promise<
              PasswordResetRecord | null
            >
          >();

        update.mockResolvedValue(null);

        mockPasswordReset.where.mockReturnValue({
          first:
            jest.fn(),
          update,
        });

        await expect(
          repository.update(reset),
        ).rejects.toThrow(
          `Password reset not found: ${reset.id}`,
        );
      },
    );
  },
);