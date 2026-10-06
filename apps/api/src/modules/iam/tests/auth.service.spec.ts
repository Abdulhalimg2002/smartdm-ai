import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import {
  AuthService,
} from '../application/services/auth.service.js';

import {
  UserService,
} from '../application/services/user.service.js';

import type {
  IAuthEventService,
} from '../application/services/auth-event.service.js';

import type {
  IUserCredentialRepository,
} from '../domain/repositories/user-credential.repository.js';

import type {
  IPasswordHasher,
} from '../application/services/password-hasher.service.js';

import type {
  ISessionService,
} from '../application/services/session.service.js';

import {
  User,
} from '../domain/entities/user.entity.js';

import {
  UserCredential,
} from '../domain/entities/user-credential.entity.js';

import {
  Session,
} from '../domain/entities/session.entity.js';

describe('IAM AuthService', () => {
  it('should register a new user', async () => {
    const findByEmailMock =
      jest.fn<
        (email: string) => Promise<unknown>
      >();

    const createUserMock =
      jest.fn<
        () => Promise<unknown>
      >();

    const createCredentialMock =
      jest.fn<
        () => Promise<unknown>
      >();

    const hashMock =
      jest.fn<
        (password: string) => Promise<string>
      >();

    const compareMock =
      jest.fn<
        (
          password: string,
          passwordHash: string,
        ) => Promise<boolean>
      >();

    const recordAuthEventMock =
      jest.fn<
        IAuthEventService['record']
      >();

    const createSessionMock =
      jest.fn<
        ISessionService['create']
      >();

    findByEmailMock.mockResolvedValue(
      null,
    );

    hashMock.mockResolvedValue(
      'hashed-password',
    );

    recordAuthEventMock.mockResolvedValue(
      {} as Awaited<
        ReturnType<IAuthEventService['record']>
      >,
    );

    const userService = {
      findByEmail: findByEmailMock,
      create: createUserMock,
    } as unknown as UserService;

    const credentialRepository = {
      create: createCredentialMock,
    } as unknown as IUserCredentialRepository;

    const passwordHasher: IPasswordHasher = {
      hash: hashMock,
      compare: compareMock,
    };

    const sessionService: ISessionService = {
      create: createSessionMock,
    };

    const authEventService: IAuthEventService = {
      record: recordAuthEventMock,
    };

    const authService =
      new AuthService(
        userService,
        credentialRepository,
        passwordHasher,
        sessionService,
        authEventService,
      );

    const result =
      await authService.register({
        email: 'test@example.com',
        password: 'StrongPassword123!',
        firstName: 'Abdul',
        lastName: 'Halim',
      });

    expect(
      findByEmailMock,
    ).toHaveBeenCalledWith(
      'test@example.com',
    );

    expect(
      hashMock,
    ).toHaveBeenCalledWith(
      'StrongPassword123!',
    );

    expect(
      createUserMock,
    ).toHaveBeenCalledTimes(1);

    expect(
      createCredentialMock,
    ).toHaveBeenCalledTimes(1);

    expect(
      recordAuthEventMock,
    ).toHaveBeenCalledWith({
      userId: result.id,
      type: 'REGISTER',
      ipAddress: undefined,
      userAgent: undefined,
    });

    expect(
      result.email,
    ).toBe(
      'test@example.com',
    );

    expect(
      result.firstName,
    ).toBe(
      'Abdul',
    );

    expect(
      result.lastName,
    ).toBe(
      'Halim',
    );
  });

  it('should reject registration when email already exists', async () => {
    const findByEmailMock =
      jest.fn<
        (email: string) => Promise<unknown>
      >();

    const createUserMock =
      jest.fn<
        () => Promise<unknown>
      >();

    const createCredentialMock =
      jest.fn<
        () => Promise<unknown>
      >();

    const hashMock =
      jest.fn<
        (password: string) => Promise<string>
      >();

    const compareMock =
      jest.fn<
        (
          password: string,
          passwordHash: string,
        ) => Promise<boolean>
      >();

    const recordAuthEventMock =
      jest.fn<
        IAuthEventService['record']
      >();

    const createSessionMock =
      jest.fn<
        ISessionService['create']
      >();

    const existingUser = {
      id: 'existing-user-id',
      email: 'test@example.com',
    };

    findByEmailMock.mockResolvedValue(
      existingUser,
    );

    const userService = {
      findByEmail: findByEmailMock,
      create: createUserMock,
    } as unknown as UserService;

    const credentialRepository = {
      create: createCredentialMock,
    } as unknown as IUserCredentialRepository;

    const passwordHasher: IPasswordHasher = {
      hash: hashMock,
      compare: compareMock,
    };

    const sessionService: ISessionService = {
      create: createSessionMock,
    };

    const authEventService: IAuthEventService = {
      record: recordAuthEventMock,
    };

    const authService =
      new AuthService(
        userService,
        credentialRepository,
        passwordHasher,
        sessionService,
        authEventService,
      );

    await expect(
      authService.register({
        email: 'test@example.com',
        password: 'StrongPassword123!',
        firstName: 'Abdul',
        lastName: 'Halim',
      }),
    ).rejects.toThrow(
      'Email already registered',
    );

    expect(
      hashMock,
    ).not.toHaveBeenCalled();

    expect(
      createUserMock,
    ).not.toHaveBeenCalled();

    expect(
      createCredentialMock,
    ).not.toHaveBeenCalled();

    expect(
      recordAuthEventMock,
    ).not.toHaveBeenCalled();

    expect(
      createSessionMock,
    ).not.toHaveBeenCalled();
  });

  it('should login with valid credentials and create a session', async () => {
    const user =
      User.createNew({
        id: 'user-1',
        email: 'abdul@example.com',
        firstName: 'Abdul',
        lastName: 'Halim',
      });

    const credentials =
      UserCredential.createNew({
        id: 'credential-1',
        userId: user.id,
        passwordHash: 'hashed-password',
      });

    const findByEmailMock =
      jest.fn<
        (
          email: string,
        ) => Promise<User | null>
      >();

    const updateUserMock =
      jest.fn<
        (user: User) => Promise<User>
      >();

    const findByUserIdMock =
      jest.fn<
        (
          userId: string,
        ) => Promise<UserCredential | null>
      >();

    const compareMock =
      jest.fn<
        (
          password: string,
          passwordHash: string,
        ) => Promise<boolean>
      >();

    const createSessionMock =
      jest.fn<
        ISessionService['create']
      >();

    const recordAuthEventMock =
      jest.fn<
        IAuthEventService['record']
      >();

    const session =
      Session.createNew({
        id: 'session-1',
        userId: user.id,
        tokenHash: 'hashed-session-token',
        expiresAt:
          new Date(
            Date.now() +
              30 * 24 * 60 * 60 * 1000,
          ),
      });

    findByEmailMock.mockResolvedValue(
      user,
    );

    updateUserMock.mockResolvedValue(
      user,
    );

    findByUserIdMock.mockResolvedValue(
      credentials,
    );

    compareMock.mockResolvedValue(
      true,
    );

    createSessionMock.mockResolvedValue({
      session,
      token: 'raw-session-token',
    });

    const userService = {
      findByEmail: findByEmailMock,
      create: jest.fn(),
      update: updateUserMock,
    } as unknown as UserService;

    const credentialRepository:
      IUserCredentialRepository = {
        findByUserId:
          findByUserIdMock,

        create:
          jest.fn<
            (
              credentials: UserCredential,
            ) => Promise<UserCredential>
          >(),

        update:
          jest.fn<
            (
              credentials: UserCredential,
            ) => Promise<UserCredential>
          >(),
      };

    const passwordHasher:
      IPasswordHasher = {
        hash:
          jest.fn<
            (
              password: string,
            ) => Promise<string>
          >(),

        compare:
          compareMock,
      };

    const sessionService:
      ISessionService = {
        create:
          createSessionMock,
      };

    const authEventService:
      IAuthEventService = {
        record:
          recordAuthEventMock,
      };

    const authService =
      new AuthService(
        userService,
        credentialRepository,
        passwordHasher,
        sessionService,
        authEventService,
      );

    const result =
      await authService.login({
        email:
          'abdul@example.com',
        password:
          'correct-password',
      });

    expect(
      findByEmailMock,
    ).toHaveBeenCalledWith(
      'abdul@example.com',
    );

    expect(
      findByUserIdMock,
    ).toHaveBeenCalledWith(
      user.id,
    );

    expect(
      compareMock,
    ).toHaveBeenCalledWith(
      'correct-password',
      'hashed-password',
    );

    expect(
      updateUserMock,
    ).toHaveBeenCalledWith(
      user,
    );

    expect(
      createSessionMock,
    ).toHaveBeenCalledTimes(1);

    expect(
      createSessionMock,
    ).toHaveBeenCalledWith({
      userId: user.id,
      ipAddress: undefined,
      userAgent: undefined,
    });

    expect(
      recordAuthEventMock,
    ).toHaveBeenCalledWith({
      userId: user.id,
      type: 'LOGIN',
      ipAddress: undefined,
      userAgent: undefined,
    });

    expect(
      result.user,
    ).toBe(
      user,
    );

    expect(
      result.token,
    ).toBe(
      'raw-session-token',
    );

    expect(
      user.lastLoginAt,
    ).not.toBeNull();
  });

  it('should reject login when email does not exist', async () => {
    const findByEmailMock =
      jest.fn<
        (
          email: string,
        ) => Promise<User | null>
      >();

    const findByUserIdMock =
      jest.fn<
        (
          userId: string,
        ) => Promise<UserCredential | null>
      >();

    const compareMock =
      jest.fn<
        (
          password: string,
          passwordHash: string,
        ) => Promise<boolean>
      >();

    const createSessionMock =
      jest.fn<
        ISessionService['create']
      >();

    const recordAuthEventMock =
      jest.fn<
        IAuthEventService['record']
      >();

    findByEmailMock.mockResolvedValue(
      null,
    );

    const userService = {
      findByEmail:
        findByEmailMock,

      create:
        jest.fn(),

      update:
        jest.fn(),
    } as unknown as UserService;

    const credentialRepository:
      IUserCredentialRepository = {
        findByUserId:
          findByUserIdMock,

        create:
          jest.fn<
            (
              credentials: UserCredential,
            ) => Promise<UserCredential>
          >(),

        update:
          jest.fn<
            (
              credentials: UserCredential,
            ) => Promise<UserCredential>
          >(),
      };

    const passwordHasher:
      IPasswordHasher = {
        hash:
          jest.fn<
            (
              password: string,
            ) => Promise<string>
          >(),

        compare:
          compareMock,
      };

    const sessionService:
      ISessionService = {
        create:
          createSessionMock,
      };

    const authEventService:
      IAuthEventService = {
        record:
          recordAuthEventMock,
      };

    const authService =
      new AuthService(
        userService,
        credentialRepository,
        passwordHasher,
        sessionService,
        authEventService,
      );

    await expect(
      authService.login({
        email:
          'not-found@example.com',
        password:
          'wrong-password',
      }),
    ).rejects.toThrow(
      'Invalid credentials',
    );

    expect(
      findByUserIdMock,
    ).not.toHaveBeenCalled();

    expect(
      compareMock,
    ).not.toHaveBeenCalled();

    expect(
      createSessionMock,
    ).not.toHaveBeenCalled();

    expect(
      recordAuthEventMock,
    ).toHaveBeenCalledWith({
      userId: null,
      type: 'LOGIN_FAILED',
      ipAddress: undefined,
      userAgent: undefined,
    });
  });

  it('should reject login when password is incorrect', async () => {
    const user =
      User.createNew({
        id: 'user-2',
        email: 'abdul2@example.com',
        firstName: 'Abdul',
        lastName: 'Halim',
      });

    const credentials =
      UserCredential.createNew({
        id: 'credential-2',
        userId: user.id,
        passwordHash: 'hashed-password',
      });

    const findByEmailMock =
      jest.fn<
        (
          email: string,
        ) => Promise<User | null>
      >();

    const findByUserIdMock =
      jest.fn<
        (
          userId: string,
        ) => Promise<UserCredential | null>
      >();

    const compareMock =
      jest.fn<
        (
          password: string,
          passwordHash: string,
        ) => Promise<boolean>
      >();

    const updateUserMock =
      jest.fn<
        (user: User) => Promise<User>
      >();

    const createSessionMock =
      jest.fn<
        ISessionService['create']
      >();

    const recordAuthEventMock =
      jest.fn<
        IAuthEventService['record']
      >();

    findByEmailMock.mockResolvedValue(
      user,
    );

    findByUserIdMock.mockResolvedValue(
      credentials,
    );

    compareMock.mockResolvedValue(
      false,
    );

    updateUserMock.mockResolvedValue(
      user,
    );

    const userService = {
      findByEmail:
        findByEmailMock,

      create:
        jest.fn(),

      update:
        updateUserMock,
    } as unknown as UserService;

    const credentialRepository:
      IUserCredentialRepository = {
        findByUserId:
          findByUserIdMock,

        create:
          jest.fn<
            (
              credentials: UserCredential,
            ) => Promise<UserCredential>
          >(),

        update:
          jest.fn<
            (
              credentials: UserCredential,
            ) => Promise<UserCredential>
          >(),
      };

    const passwordHasher:
      IPasswordHasher = {
        hash:
          jest.fn<
            (
              password: string,
            ) => Promise<string>
          >(),

        compare:
          compareMock,
      };

    const sessionService:
      ISessionService = {
        create:
          createSessionMock,
      };

    const authEventService:
      IAuthEventService = {
        record:
          recordAuthEventMock,
      };

    const authService =
      new AuthService(
        userService,
        credentialRepository,
        passwordHasher,
        sessionService,
        authEventService,
      );

    await expect(
      authService.login({
        email:
          'abdul2@example.com',
        password:
          'wrong-password',
      }),
    ).rejects.toThrow(
      'Invalid credentials',
    );

    expect(
      updateUserMock,
    ).not.toHaveBeenCalled();

    expect(
      createSessionMock,
    ).not.toHaveBeenCalled();

    expect(
      recordAuthEventMock,
    ).toHaveBeenCalledWith({
      userId: user.id,
      type: 'LOGIN_FAILED',
      ipAddress: undefined,
      userAgent: undefined,
    });
  });
});