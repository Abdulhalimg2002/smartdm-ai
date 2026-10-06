
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
} from '@jest/globals';

import {
  RevokeSessionService,
} from '../application/services/revoke-session.service.impl.js';

import {
  InvalidSessionError,
} from '../application/errors/invalid-session.error.js';

import {
  Session,
} from '../domain/entities/session.entity.js';

import type {
  ISessionRepository,
} from '../domain/repositories/session.repository.js';

describe('RevokeSessionService', () => {
  const sessionRepository: {
    findById: jest.MockedFunction<
      ISessionRepository['findById']
    >;
    findByTokenHash: jest.MockedFunction<
      ISessionRepository['findByTokenHash']
    >;
    create: jest.MockedFunction<
      ISessionRepository['create']
    >;
    update: jest.MockedFunction<
      ISessionRepository['update']
    >;
    revokeAllByUserId: jest.MockedFunction<
      ISessionRepository['revokeAllByUserId']
    >;
  } = {
    findById: jest.fn(),
    findByTokenHash: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    revokeAllByUserId: jest.fn(),
  };

  const service = new RevokeSessionService(
    sessionRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should revoke a valid session belonging to the user', async () => {
    const session = Session.createNew({
      id: 'session-1',
      userId: 'user-1',
      tokenHash: 'hashed-token',
      expiresAt: new Date(
        Date.now() + 60_000,
      ),
    });

    sessionRepository.findById.mockResolvedValue(
      session,
    );

    sessionRepository.update.mockResolvedValue(
      session,
    );

    await service.revokeSession(
      'session-1',
      'user-1',
    );

    expect(
      sessionRepository.findById,
    ).toHaveBeenCalledWith(
      'session-1',
    );

    expect(session.isRevoked()).toBe(true);

    expect(
      sessionRepository.update,
    ).toHaveBeenCalledWith(
      session,
    );
  });

  it('should reject when session does not exist', async () => {
    sessionRepository.findById.mockResolvedValue(
      null,
    );

    await expect(
      service.revokeSession(
        'session-1',
        'user-1',
      ),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      sessionRepository.update,
    ).not.toHaveBeenCalled();
  });

  it('should reject when session belongs to another user', async () => {
    const session = Session.createNew({
      id: 'session-1',
      userId: 'user-2',
      tokenHash: 'hashed-token',
      expiresAt: new Date(
        Date.now() + 60_000,
      ),
    });

    sessionRepository.findById.mockResolvedValue(
      session,
    );

    await expect(
      service.revokeSession(
        'session-1',
        'user-1',
      ),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      sessionRepository.update,
    ).not.toHaveBeenCalled();

    expect(
      session.isRevoked(),
    ).toBe(false);
  });

  it('should reject when session is expired', async () => {
    const session = Session.createNew({
      id: 'session-expired',
      userId: 'user-1',
      tokenHash: 'hashed-token',
      expiresAt: new Date(
        Date.now() - 60_000,
      ),
    });

    sessionRepository.findById.mockResolvedValue(
      session,
    );

    await expect(
      service.revokeSession(
        'session-expired',
        'user-1',
      ),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      sessionRepository.update,
    ).not.toHaveBeenCalled();

    expect(
      session.isRevoked(),
    ).toBe(false);
  });

  it('should reject when session is already revoked', async () => {
    const session = Session.create({
      id: 'session-revoked',
      userId: 'user-1',
      tokenHash: 'hashed-token',
      ipAddress: null,
      userAgent: null,
      lastActivityAt: new Date(),
      expiresAt: new Date(
        Date.now() + 60_000,
      ),
      revokedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    sessionRepository.findById.mockResolvedValue(
      session,
    );

    await expect(
      service.revokeSession(
        'session-revoked',
        'user-1',
      ),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      sessionRepository.update,
    ).not.toHaveBeenCalled();
  });
});

