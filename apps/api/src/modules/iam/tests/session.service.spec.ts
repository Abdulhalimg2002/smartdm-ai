import { SessionService } from '../application/services/session.service.js';

import {
  type ISessionRepository,
} from '../domain/repositories/session.repository.js';

import {
  type ISessionTokenService,
} from '../application/services/session-token.service.js';
import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

describe('SessionService', () => {
  let service: SessionService;

  let sessionRepository: jest.Mocked<ISessionRepository>;
  let sessionTokenService: jest.Mocked<ISessionTokenService>;

  beforeEach(() => {
    sessionRepository = {
      findById: jest.fn(),
      findByTokenHash: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      revokeAllByUserId: jest.fn(),
    };

    sessionTokenService = {
      generate: jest.fn(),
      hash: jest.fn(),
    };

    service = new SessionService(
      sessionRepository,
      sessionTokenService,
    );
  });

  it('should create a session', async () => {
    const rawToken =
      'raw-session-token';

    const tokenHash =
      'hashed-session-token';

    sessionTokenService.generate.mockReturnValue(
      rawToken,
    );

    sessionTokenService.hash.mockReturnValue(
      tokenHash,
    );

    sessionRepository.create.mockImplementation(
      async (session) => session,
    );

    const result =
      await service.create({
        userId: 'user-123',
      });

    expect(
      sessionTokenService.generate,
    ).toHaveBeenCalledTimes(1);

    expect(
      sessionTokenService.hash,
    ).toHaveBeenCalledWith(
      rawToken,
    );

    expect(
      sessionRepository.create,
    ).toHaveBeenCalledTimes(1);

    expect(result.token).toBe(
      rawToken,
    );

    expect(result.session.userId).toBe(
      'user-123',
    );

    expect(
      result.session.tokenHash,
    ).toBe(tokenHash);
  });

  it('should create a session with ip address and user agent', async () => {
    const rawToken =
      'raw-session-token';

    const tokenHash =
      'hashed-session-token';

    sessionTokenService.generate.mockReturnValue(
      rawToken,
    );

    sessionTokenService.hash.mockReturnValue(
      tokenHash,
    );

    sessionRepository.create.mockImplementation(
      async (session) => session,
    );

    const result =
      await service.create({
        userId: 'user-123',
        ipAddress: '127.0.0.1',
        userAgent: 'PostmanRuntime/7.51.1',
      });

    expect(
      result.session.ipAddress,
    ).toBe('127.0.0.1');

    expect(
      result.session.userAgent,
    ).toBe(
      'PostmanRuntime/7.51.1',
    );
  });

  it('should create a session with an expiration time approximately 30 days from now', async () => {
    const before =
      Date.now();

    sessionTokenService.generate.mockReturnValue(
      'raw-token',
    );

    sessionTokenService.hash.mockReturnValue(
      'hashed-token',
    );

    sessionRepository.create.mockImplementation(
      async (session) => session,
    );

    const result =
      await service.create({
        userId: 'user-123',
      });

    const after =
      Date.now();

    const expectedDuration =
      30 * 24 * 60 * 60 * 1000;

    const actualExpiration =
      result.session.expiresAt.getTime();

    expect(
      actualExpiration,
    ).toBeGreaterThanOrEqual(
      before + expectedDuration,
    );

    expect(
      actualExpiration,
    ).toBeLessThanOrEqual(
      after + expectedDuration,
    );
  });

  it('should return the created session from the repository', async () => {
    const rawToken =
      'raw-token';

    const tokenHash =
      'hashed-token';

    sessionTokenService.generate.mockReturnValue(
      rawToken,
    );

    sessionTokenService.hash.mockReturnValue(
      tokenHash,
    );

    const createdSession = {
      id: 'session-123',
    } as any;

    sessionRepository.create.mockResolvedValue(
      createdSession,
    );

    const result =
      await service.create({
        userId: 'user-123',
      });

    expect(result.session).toBe(
      createdSession,
    );
  });
});