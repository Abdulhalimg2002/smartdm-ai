import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import {
  SessionValidationService,
} from '../application/services/session-validation.service.impl.js';

import {
  InvalidSessionError,
} from '../application/errors/invalid-session.error.js';

import type {
  ISessionRepository,
} from '../domain/repositories/session.repository.js';

import type {
  IUserRepository,
} from '../domain/repositories/user.repository.js';

import type {
  ISessionTokenService,
} from '../application/services/session-token.service.js';

import {
  Session,
} from '../domain/entities/session.entity.js';

import {
  User,
} from '../domain/entities/user.entity.js';

describe('IAM SessionValidationService', () => {
  const createMocks = () => {
    const findByTokenHashMock =
      jest.fn<
        (
          tokenHash: string,
        ) => Promise<Session | null>
      >();

    const findUserByIdMock =
      jest.fn<
        (
          id: string,
        ) => Promise<User | null>
      >();

    const hashTokenMock =
      jest.fn<
        (token: string) => string
      >();

    const sessionRepository: ISessionRepository = {
      findById:
        jest.fn<
          (
            id: string,
          ) => Promise<Session | null>
        >(),

      findByTokenHash:
        findByTokenHashMock,

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
    };

    const userRepository: IUserRepository = {
      findById:
        findUserByIdMock,

      findByEmail:
        jest.fn<
          (
            email: string,
          ) => Promise<User | null>
        >(),

      create:
        jest.fn<
          (
            user: User,
          ) => Promise<User>
        >(),

      update:
        jest.fn<
          (
            user: User,
          ) => Promise<User>
        >(),
    };

    const sessionTokenService: ISessionTokenService = {
      generate:
        jest.fn<
          () => string
        >(),

      hash:
        hashTokenMock,
    };

    return {
      sessionRepository,
      userRepository,
      sessionTokenService,
      findByTokenHashMock,
      findUserByIdMock,
      hashTokenMock,
    };
  };

  it('should validate a valid session and return session with user', async () => {
    const user = User.createNew({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
    });

    const session = Session.create({
      id: 'session-1',
      userId: user.id,
      tokenHash: 'hashed-token',
      ipAddress: null,
      userAgent: null,
      lastActivityAt: new Date(),
      expiresAt:
        new Date(
          Date.now() + 60_000,
        ),
      revokedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const {
      sessionRepository,
      userRepository,
      sessionTokenService,
      findByTokenHashMock,
      findUserByIdMock,
      hashTokenMock,
    } = createMocks();

    hashTokenMock.mockReturnValue(
      'hashed-token',
    );

    findByTokenHashMock.mockResolvedValue(
      session,
    );

    findUserByIdMock.mockResolvedValue(
      user,
    );

    const service =
      new SessionValidationService(
        sessionRepository,
        userRepository,
        sessionTokenService,
      );

    const result =
      await service.validate(
        'raw-token',
      );

    expect(
      hashTokenMock,
    ).toHaveBeenCalledWith(
      'raw-token',
    );

    expect(
      findByTokenHashMock,
    ).toHaveBeenCalledWith(
      'hashed-token',
    );

    expect(
      findUserByIdMock,
    ).toHaveBeenCalledWith(
      user.id,
    );

    expect(result).toEqual({
      session,
      user,
    });
  });

  it('should reject when session does not exist', async () => {
    const {
      sessionRepository,
      userRepository,
      sessionTokenService,
      findByTokenHashMock,
      findUserByIdMock,
      hashTokenMock,
    } = createMocks();

    hashTokenMock.mockReturnValue(
      'hashed-token',
    );

    findByTokenHashMock.mockResolvedValue(
      null,
    );

    const service =
      new SessionValidationService(
        sessionRepository,
        userRepository,
        sessionTokenService,
      );

    await expect(
      service.validate('raw-token'),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      findUserByIdMock,
    ).not.toHaveBeenCalled();
  });

  it('should reject when session is revoked', async () => {
    const revokedSession =
      Session.create({
        id: 'session-1',
        userId: 'user-1',
        tokenHash: 'hashed-token',
        ipAddress: null,
        userAgent: null,
        lastActivityAt: new Date(),
        expiresAt:
          new Date(
            Date.now() + 60_000,
          ),
        revokedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const {
      sessionRepository,
      userRepository,
      sessionTokenService,
      findByTokenHashMock,
      findUserByIdMock,
      hashTokenMock,
    } = createMocks();

    hashTokenMock.mockReturnValue(
      'hashed-token',
    );

    findByTokenHashMock.mockResolvedValue(
      revokedSession,
    );

    const service =
      new SessionValidationService(
        sessionRepository,
        userRepository,
        sessionTokenService,
      );

    await expect(
      service.validate('raw-token'),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      findUserByIdMock,
    ).not.toHaveBeenCalled();
  });

  it('should reject when session is expired', async () => {
    const expiredSession =
      Session.create({
        id: 'session-1',
        userId: 'user-1',
        tokenHash: 'hashed-token',
        ipAddress: null,
        userAgent: null,
        lastActivityAt: new Date(),
        expiresAt:
          new Date(
            Date.now() - 60_000,
          ),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const {
      sessionRepository,
      userRepository,
      sessionTokenService,
      findByTokenHashMock,
      findUserByIdMock,
      hashTokenMock,
    } = createMocks();

    hashTokenMock.mockReturnValue(
      'hashed-token',
    );

    findByTokenHashMock.mockResolvedValue(
      expiredSession,
    );

    const service =
      new SessionValidationService(
        sessionRepository,
        userRepository,
        sessionTokenService,
      );

    await expect(
      service.validate('raw-token'),
    ).rejects.toThrow(
      InvalidSessionError,
    );

    expect(
      findUserByIdMock,
    ).not.toHaveBeenCalled();
  });

  it('should reject when user does not exist', async () => {
    const session = Session.create({
      id: 'session-1',
      userId: 'user-1',
      tokenHash: 'hashed-token',
      ipAddress: null,
      userAgent: null,
      lastActivityAt: new Date(),
      expiresAt:
        new Date(
          Date.now() + 60_000,
        ),
      revokedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const {
      sessionRepository,
      userRepository,
      sessionTokenService,
      findByTokenHashMock,
      findUserByIdMock,
      hashTokenMock,
    } = createMocks();

    hashTokenMock.mockReturnValue(
      'hashed-token',
    );

    findByTokenHashMock.mockResolvedValue(
      session,
    );

    findUserByIdMock.mockResolvedValue(
      null,
    );

    const service =
      new SessionValidationService(
        sessionRepository,
        userRepository,
        sessionTokenService,
      );

    await expect(
      service.validate('raw-token'),
    ).rejects.toThrow(
      InvalidSessionError,
    );
  });
});