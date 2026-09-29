
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
} from '@jest/globals';

import {
  LogoutService,
} from '../application/services/logout.service.impl.js';

import {
  InvalidSessionError,
} from '../application/errors/invalid-session.error.js';

import {
  Session,
} from '../domain/entities/session.entity.js';

import type {
  ISessionRepository,
} from '../domain/repositories/session.repository.js';

import type {
  ISessionTokenService,
} from '../application/services/session-token.service.js';

describe('LogoutService', () => {
 const sessionTokenService: {
  generate: jest.MockedFunction<
    ISessionTokenService['generate']
  >;
  hash: jest.MockedFunction<
    ISessionTokenService['hash']
  >;
} = {
  generate: jest.fn(),
  hash: jest.fn(),
};

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
  } = {
    findById: jest.fn(),
    findByTokenHash: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const service = new LogoutService(
    sessionRepository,
    sessionTokenService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should revoke a valid session', async () => {
    const session = Session.createNew({
      id: 'session-1',
      userId: 'user-1',
      tokenHash: 'hashed-token',
      expiresAt: new Date(
        Date.now() + 60_000,
      ),
    });

    sessionTokenService.hash.mockReturnValue(
      'hashed-token',
    );

    sessionRepository.findByTokenHash.mockResolvedValue(
      session,
    );

    sessionRepository.update.mockResolvedValue(
      session,
    );

    await service.logout('raw-token');

    expect(
      sessionTokenService.hash,
    ).toHaveBeenCalledWith(
      'raw-token',
    );

    expect(
      sessionRepository.findByTokenHash,
    ).toHaveBeenCalledWith(
      'hashed-token',
    );

    expect(session.isRevoked()).toBe(true);

    expect(
      sessionRepository.update,
    ).toHaveBeenCalledWith(
      session,
    );
  });

  it('should reject when session does not exist', async () => {
    sessionTokenService.hash.mockReturnValue(
      'hashed-token',
    );

    sessionRepository.findByTokenHash.mockResolvedValue(
      null,
    );

    await expect(
      service.logout('raw-token'),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      sessionRepository.update,
    ).not.toHaveBeenCalled();
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

    sessionTokenService.hash.mockReturnValue(
      'hashed-token',
    );

    sessionRepository.findByTokenHash.mockResolvedValue(
      session,
    );

    await expect(
      service.logout('raw-token'),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      sessionRepository.update,
    ).not.toHaveBeenCalled();
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

    sessionTokenService.hash.mockReturnValue(
      'hashed-token',
    );

    sessionRepository.findByTokenHash.mockResolvedValue(
      session,
    );

    await expect(
      service.logout('raw-token'),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      sessionRepository.update,
    ).not.toHaveBeenCalled();
  });
});

