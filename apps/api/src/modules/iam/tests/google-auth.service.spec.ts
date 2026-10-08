import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import {
  User,
  UserStatus,
} from '../domain/entities/user.entity.js';

import {
  AuthProvider,
} from '../domain/entities/auth-provider.entity.js';

import {
  UserAuthProvider,
} from '../domain/entities/user-auth-provider.entity.js';

import {
  Session,
} from '../domain/entities/session.entity.js';

import {
  type IGoogleOAuthClient,
  type GoogleUserProfile,
} from '../domain/services/google-oauth.client.js';

import {
  UserService,
} from '../application/services/user.service.js';

import {
  AuthProviderService,
} from '../application/services/auth-provider.service.js';

import {
  UserAuthProviderService,
} from '../application/services/user-auth-provider.service.js';

import {
  type ISessionService,
} from '../application/services/session.service.js';

import {
  type IAuthEventService,
} from '../application/services/auth-event.service.js';

import {
  GoogleAuthServiceImpl,
} from '../application/services/google-auth.service.impl.js';

import {
  GoogleEmailNotVerifiedError,
} from '../application/errors/google-email-not-verified.error.js';

import {
  UserCannotAuthenticateError,
} from '../application/errors/user-cannot-authenticate.error.js';

import {
  AuthProviderNotFoundError,
} from '../application/errors/auth-provider-not-found.error.js';
import { AuthProviderInactiveError } from '../application/errors/auth-provider-inactive.error.js';
import { UserAuthProviderInactiveError } from '../application/errors/user-auth-provider-inactive.error.js';

describe('GoogleAuthServiceImpl', () => {
  let googleOAuthClient: jest.Mocked<
    IGoogleOAuthClient
  >;

  let userService: jest.Mocked<
    Pick<
      UserService,
      | 'findById'
      | 'findByEmail'
      | 'create'
      | 'update'
    >
  >;

  let authProviderService: jest.Mocked<
    Pick<
      AuthProviderService,
      'findByCode'
    >
  >;

  let userAuthProviderService: jest.Mocked<
    Pick<
      UserAuthProviderService,
      | 'findByProviderUserId'
      | 'findByUserAndProvider'
      | 'linkProvider'
      | 'markUsed'
    >
  >;

  let sessionService: jest.Mocked<
    ISessionService
  >;

  let authEventService: jest.Mocked<
    IAuthEventService
  >;

  let service: GoogleAuthServiceImpl;

  beforeEach(() => {
    googleOAuthClient = {
      getAuthorizationUrl:
        jest.fn(),

      exchangeCodeForProfile:
        jest.fn(),
    };

    userService = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    authProviderService = {
      findByCode: jest.fn(),
    };

    userAuthProviderService = {
      findByProviderUserId:
        jest.fn(),

      findByUserAndProvider:
        jest.fn(),

      linkProvider:
        jest.fn(),

      markUsed:
        jest.fn(),
    };

    sessionService = {
      create: jest.fn(),
    };

    authEventService = {
      record: jest.fn(),
    };

    service = new GoogleAuthServiceImpl(
      googleOAuthClient,
      userService,
      authProviderService,
      userAuthProviderService,
      sessionService,
      authEventService,
    );

    jest.clearAllMocks();
  });

  const createGoogleProfile = (
    overrides?: Partial<GoogleUserProfile>,
  ): GoogleUserProfile => ({
    providerUserId:
      'google-user-123',

    email:
      'abdul@gmail.com',

    emailVerified:
      true,

    firstName:
      'Abdul',

    lastName:
      'Halim',

    avatarUrl:
      null,

    ...overrides,
  });

  const createGoogleProvider = () =>
    AuthProvider.createNew({
      id:
        'google-provider-id',

      name:
        'Google',

      code:
        'GOOGLE',

      description:
        'Google authentication',

      sortOrder:
        1,
    });

  const createUser = () =>
    User.createNew({
      id:
        'user-1',

      email:
        'abdul@gmail.com',

      firstName:
        'Abdul',

      lastName:
        'Halim',
    });

  const createUserAuthProvider = (
    userId: string,
    authProviderId: string,
  ) =>
    UserAuthProvider.createNew({
      id:
        'user-auth-provider-1',

      userId,

      authProviderId,

      providerUserId:
        'google-user-123',

      providerEmail:
        'abdul@gmail.com',
    });

  const createSession = (
    userId: string,
  ) =>
    Session.createNew({
      id:
        'session-1',

      userId,

      tokenHash:
        'hashed-token',

      expiresAt:
        new Date(
          Date.now() +
            30 *
              24 *
              60 *
              60 *
              1000,
        ),
    });

  it(
    'should login when Google account is already linked',
    async () => {
      const provider =
        createGoogleProvider();

      const user =
        createUser();

      const userAuthProvider =
        createUserAuthProvider(
          user.id,
          provider.id,
        );

      const session =
        createSession(user.id);

      googleOAuthClient
        .exchangeCodeForProfile
        .mockResolvedValue(
          createGoogleProfile(),
        );

      authProviderService
        .findByCode
        .mockResolvedValue(
          provider,
        );

      userAuthProviderService
        .findByProviderUserId
        .mockResolvedValue(
          userAuthProvider,
        );

      userService
        .findById
        .mockResolvedValue(
          user,
        );

      userAuthProviderService
        .markUsed
        .mockResolvedValue(
          userAuthProvider,
        );

      userService
        .update
        .mockResolvedValue(
          user,
        );

      sessionService
        .create
        .mockResolvedValue({
          session,
          token:
            'session-token',
        });

      authEventService
        .record
        .mockResolvedValue(
          {} as never,
        );

      const result =
        await service.loginWithCode({
          code:
            'google-code',

          ipAddress:
            '127.0.0.1',

          userAgent:
            'Jest',
        });

      expect(result.user)
        .toBe(user);

      expect(result.token)
        .toBe('session-token');

      expect(
        googleOAuthClient
          .exchangeCodeForProfile,
      ).toHaveBeenCalledWith(
        'google-code',
      );

      expect(
        authProviderService
          .findByCode,
      ).toHaveBeenCalledWith(
        'GOOGLE',
      );

      expect(
        userAuthProviderService
          .findByProviderUserId,
      ).toHaveBeenCalledWith(
        provider.id,
        'google-user-123',
      );

      expect(
        userService.findById,
      ).toHaveBeenCalledWith(
        user.id,
      );

      expect(
        userAuthProviderService
          .markUsed,
      ).toHaveBeenCalledWith(
        userAuthProvider,
      );

      expect(
        sessionService.create,
      ).toHaveBeenCalledWith({
        userId:
          user.id,

        ipAddress:
          '127.0.0.1',

        userAgent:
          'Jest',
      });

      expect(
        authEventService.record,
      ).toHaveBeenCalledWith({
        userId:
          user.id,

        type:
          'LOGIN',

        ipAddress:
          '127.0.0.1',

        userAgent:
          'Jest',
      });
    },
  );

  it(
    'should link Google account to an existing user',
    async () => {
      const provider =
        createGoogleProvider();

      const user =
        createUser();

      const userAuthProvider =
        createUserAuthProvider(
          user.id,
          provider.id,
        );

      const session =
        createSession(user.id);

      googleOAuthClient
        .exchangeCodeForProfile
        .mockResolvedValue(
          createGoogleProfile(),
        );

      authProviderService
        .findByCode
        .mockResolvedValue(
          provider,
        );

      userAuthProviderService
        .findByProviderUserId
        .mockResolvedValue(
          null,
        );

      userService
        .findByEmail
        .mockResolvedValue(
          user,
        );

      userAuthProviderService
        .linkProvider
        .mockResolvedValue(
          userAuthProvider,
        );

      userAuthProviderService
        .markUsed
        .mockResolvedValue(
          userAuthProvider,
        );

      userService
        .update
        .mockResolvedValue(
          user,
        );

      sessionService
        .create
        .mockResolvedValue({
          session,
          token:
            'session-token',
        });

      authEventService
        .record
        .mockResolvedValue(
          {} as never,
        );

      const result =
        await service.loginWithCode({
          code:
            'google-code',
        });

      expect(
  userService.findByEmail,
).toHaveBeenCalledWith(
  'abdul@gmail.com',
);

expect(
  userService.create,
).not.toHaveBeenCalled();

expect(
  userService.update,
).toHaveBeenCalled();

expect(
  userAuthProviderService.linkProvider,
).toHaveBeenCalledWith({
  id: expect.any(String),
  userId: user.id,
  authProviderId: provider.id,
  providerUserId: 'google-user-123',
  providerEmail: 'abdul@gmail.com',
});
    },
  );

  it(
    'should create a new user and link Google account',
    async () => {
      const provider =
        createGoogleProvider();

      const createdUser =
        createUser();

      const userAuthProvider =
        createUserAuthProvider(
          createdUser.id,
          provider.id,
        );

      const session =
        createSession(
          createdUser.id,
        );

      googleOAuthClient
        .exchangeCodeForProfile
        .mockResolvedValue(
          createGoogleProfile(),
        );

      authProviderService
        .findByCode
        .mockResolvedValue(
          provider,
        );

      userAuthProviderService
        .findByProviderUserId
        .mockResolvedValue(
          null,
        );

      userService
        .findByEmail
        .mockResolvedValue(
          null,
        );

      userService
        .create
        .mockResolvedValue(
          createdUser,
        );

      userAuthProviderService
        .linkProvider
        .mockResolvedValue(
          userAuthProvider,
        );

      userAuthProviderService
        .markUsed
        .mockResolvedValue(
          userAuthProvider,
        );

      userService
        .update
        .mockResolvedValue(
          createdUser,
        );

      sessionService
        .create
        .mockResolvedValue({
          session,
          token:
            'session-token',
        });

      authEventService
        .record
        .mockResolvedValue(
          {} as never,
        );

      const result =
        await service.loginWithCode({
          code:
            'google-code',
        });

      expect(result.user)
        .toBe(createdUser);

      expect(result.token)
        .toBe('session-token');

      expect(
        userService.create,
      ).toHaveBeenCalledTimes(1);

      const createdUserArg =
        userService.create
          .mock.calls[0][0];

      expect(
        createdUserArg.email,
      ).toBe('abdul@gmail.com');

      expect(
        createdUserArg
          .emailVerifiedAt,
      ).not.toBeNull();

      expect(
        userAuthProviderService
          .linkProvider,
      ).toHaveBeenCalledWith({
        id:
          expect.any(String),

        userId:
          createdUser.id,

        authProviderId:
          provider.id,

        providerUserId:
          'google-user-123',

        providerEmail:
          'abdul@gmail.com',
      });
    },
  );

  it(
    'should reject when Google email is not verified',
    async () => {
      googleOAuthClient
        .exchangeCodeForProfile
        .mockResolvedValue(
          createGoogleProfile({
            emailVerified:
              false,
          }),
        );

      await expect(
        service.loginWithCode({
          code:
            'google-code',
        }),
      ).rejects.toBeInstanceOf(
        GoogleEmailNotVerifiedError,
      );

      expect(
        authProviderService
          .findByCode,
      ).not.toHaveBeenCalled();

      expect(
        userService.findByEmail,
      ).not.toHaveBeenCalled();

      expect(
        userService.create,
      ).not.toHaveBeenCalled();

      expect(
        sessionService.create,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    'should reject when user cannot authenticate',
    async () => {
      const provider =
        createGoogleProvider();

      const user =
        User.create({
          id:
            'user-1',

          email:
            'abdul@gmail.com',

          firstName:
            'Abdul',

          lastName:
            'Halim',

          status:
            UserStatus.INACTIVE,

          emailVerifiedAt:
            null,

          lastLoginAt:
            null,

          createdAt:
            new Date(),

          updatedAt:
            new Date(),
        });

      const userAuthProvider =
        createUserAuthProvider(
          user.id,
          provider.id,
        );

      googleOAuthClient
        .exchangeCodeForProfile
        .mockResolvedValue(
          createGoogleProfile(),
        );

      authProviderService
        .findByCode
        .mockResolvedValue(
          provider,
        );

      userAuthProviderService
        .findByProviderUserId
        .mockResolvedValue(
          userAuthProvider,
        );

      userService
        .findById
        .mockResolvedValue(
          user,
        );

      await expect(
        service.loginWithCode({
          code:
            'google-code',
        }),
      ).rejects.toBeInstanceOf(
        UserCannotAuthenticateError,
      );

      expect(
        userAuthProviderService
          .markUsed,
      ).not.toHaveBeenCalled();

      expect(
        sessionService.create,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    'should reject when Google authentication provider does not exist',
    async () => {
      googleOAuthClient
        .exchangeCodeForProfile
        .mockResolvedValue(
          createGoogleProfile(),
        );

      authProviderService
        .findByCode
        .mockResolvedValue(
          null,
        );

      await expect(
        service.loginWithCode({
          code:
            'google-code',
        }),
      ).rejects.toBeInstanceOf(
        AuthProviderNotFoundError,
      );

      expect(
        userAuthProviderService
          .findByProviderUserId,
      ).not.toHaveBeenCalled();

      expect(
        userService.findByEmail,
      ).not.toHaveBeenCalled();

      expect(
        sessionService.create,
      ).not.toHaveBeenCalled();
    },
  );
  it(
  'should reject login when Google provider is inactive',
  async () => {
    const profile = {
      providerUserId: 'google-123',
      email: 'abdul@gmail.com',
      emailVerified: true,
      firstName: 'Abdul',
      lastName: 'Halim',
      avatarUrl: null,
    };

    googleOAuthClient.exchangeCodeForProfile
      .mockResolvedValue(profile);

    authProviderService.findByCode
      .mockResolvedValue(
        AuthProvider.create({
          id: 'google-provider-id',
          name: 'Google',
          code: 'GOOGLE',
          description: 'Google Authentication',
          isActive: false,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

    await expect(
      service.loginWithCode({
        code: 'google-code',
      }),
    ).rejects.toThrow(
      AuthProviderInactiveError,
    );

    expect(
      userService.findByEmail,
    ).not.toHaveBeenCalled();

    expect(
      userAuthProviderService
        .findByProviderUserId,
    ).not.toHaveBeenCalled();

    expect(
      sessionService.create,
    ).not.toHaveBeenCalled();

    expect(
      authEventService.record,
    ).not.toHaveBeenCalled();
  },
);
it(
  'should reject login when user Google provider link is inactive',
  async () => {
    const profile = {
      providerUserId: 'google-123',
      email: 'abdul@gmail.com',
      emailVerified: true,
      firstName: 'Abdul',
      lastName: 'Halim',
      avatarUrl: null,
    };

    googleOAuthClient.exchangeCodeForProfile
      .mockResolvedValue(profile);

    authProviderService.findByCode
      .mockResolvedValue(
        AuthProvider.create({
          id: 'google-provider-id',
          name: 'Google',
          code: 'GOOGLE',
          description:
            'Google Authentication',
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

    userAuthProviderService
      .findByProviderUserId
      .mockResolvedValue(
        UserAuthProvider.create({
          id: 'user-auth-provider-1',
          userId: 'user-1',
          authProviderId:
            'google-provider-id',
          providerUserId: 'google-123',
          providerEmail:
            'abdul@gmail.com',
          isActive: false,
          lastUsedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

    await expect(
      service.loginWithCode({
        code: 'google-code',
      }),
    ).rejects.toThrow(
      UserAuthProviderInactiveError,
    );

    expect(
      userService.findById,
    ).not.toHaveBeenCalled();

    expect(
      userService.findByEmail,
    ).not.toHaveBeenCalled();

    expect(
      userAuthProviderService.markUsed,
    ).not.toHaveBeenCalled();

    expect(
      sessionService.create,
    ).not.toHaveBeenCalled();

    expect(
      authEventService.record,
    ).not.toHaveBeenCalled();
  },
);
it(
  'should reject Google login when existing user cannot authenticate',
  async () => {
    const profile = {
      providerUserId: 'google-123',
      email: 'abdul@gmail.com',
      emailVerified: true,
      firstName: 'Abdul',
      lastName: 'Halim',
      avatarUrl: null,
    };

    googleOAuthClient.exchangeCodeForProfile
      .mockResolvedValue(profile);

    authProviderService.findByCode
      .mockResolvedValue(
        AuthProvider.create({
          id: 'google-provider-id',
          name: 'Google',
          code: 'GOOGLE',
          description: 'Google Authentication',
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

    userAuthProviderService.findByProviderUserId
      .mockResolvedValue(null);

    const inactiveUser = User.create({
      id: 'user-1',
      email: 'abdul@gmail.com',
      firstName: 'Abdul',
      lastName: 'Halim',
      status: UserStatus.INACTIVE,
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    userService.findByEmail
      .mockResolvedValue(inactiveUser);

    await expect(
      service.loginWithCode({
        code: 'google-code',
      }),
    ).rejects.toThrow(
      UserCannotAuthenticateError,
    );

    expect(
      userService.update,
    ).not.toHaveBeenCalled();

    expect(
      userAuthProviderService.linkProvider,
    ).not.toHaveBeenCalled();

    expect(
      sessionService.create,
    ).not.toHaveBeenCalled();

    expect(
      authEventService.record,
    ).not.toHaveBeenCalled();
  },
);
it(
  'should propagate Google OAuth exchange errors',
  async () => {
    const googleOAuthError =
      new Error(
        'invalid_grant',
      );

    googleOAuthClient
      .exchangeCodeForProfile
      .mockRejectedValue(
        googleOAuthError,
      );

    await expect(
      service.loginWithCode({
        code: 'invalid-google-code',
      }),
    ).rejects.toThrow(
      googleOAuthError,
    );

    expect(
      authProviderService.findByCode,
    ).not.toHaveBeenCalled();

    expect(
      userService.findByEmail,
    ).not.toHaveBeenCalled();

    expect(
      userService.create,
    ).not.toHaveBeenCalled();

    expect(
      sessionService.create,
    ).not.toHaveBeenCalled();

    expect(
      authEventService.record,
    ).not.toHaveBeenCalled();
  },
);
it(
  'should not record LOGIN event when session creation fails',
  async () => {
    const provider =
      createGoogleProvider();

    const user =
      createUser();

    const userAuthProvider =
      createUserAuthProvider(
        user.id,
        provider.id,
      );

    const sessionError =
      new Error(
        'Session creation failed',
      );

    googleOAuthClient
      .exchangeCodeForProfile
      .mockResolvedValue(
        createGoogleProfile(),
      );

    authProviderService
      .findByCode
      .mockResolvedValue(
        provider,
      );

    userAuthProviderService
      .findByProviderUserId
      .mockResolvedValue(
        userAuthProvider,
      );

    userService
      .findById
      .mockResolvedValue(
        user,
      );

    userAuthProviderService
      .markUsed
      .mockResolvedValue(
        userAuthProvider,
      );

    userService
      .update
      .mockResolvedValue(
        user,
      );

    sessionService
      .create
      .mockRejectedValue(
        sessionError,
      );

    await expect(
      service.loginWithCode({
        code: 'google-code',
      }),
    ).rejects.toThrow(
      sessionError,
    );

    expect(
      sessionService.create,
    ).toHaveBeenCalled();

    expect(
      authEventService.record,
    ).not.toHaveBeenCalled();
  },
);
it(
  'should propagate auth event errors after session creation',
  async () => {
    const provider =
      createGoogleProvider();

    const user =
      createUser();

    const userAuthProvider =
      createUserAuthProvider(
        user.id,
        provider.id,
      );

    const session =
      createSession(user.id);

    const authEventError =
      new Error(
        'Auth event recording failed',
      );

    googleOAuthClient
      .exchangeCodeForProfile
      .mockResolvedValue(
        createGoogleProfile(),
      );

    authProviderService
      .findByCode
      .mockResolvedValue(
        provider,
      );

    userAuthProviderService
      .findByProviderUserId
      .mockResolvedValue(
        userAuthProvider,
      );

    userService
      .findById
      .mockResolvedValue(
        user,
      );

    userAuthProviderService
      .markUsed
      .mockResolvedValue(
        userAuthProvider,
      );

    userService
      .update
      .mockResolvedValue(
        user,
      );

    sessionService
      .create
      .mockResolvedValue({
        session,
        token: 'session-token',
      });

    authEventService
      .record
      .mockRejectedValue(
        authEventError,
      );

    await expect(
      service.loginWithCode({
        code: 'google-code',
      }),
    ).rejects.toThrow(
      authEventError,
    );

    expect(
      sessionService.create,
    ).toHaveBeenCalled();

    expect(
      authEventService.record,
    ).toHaveBeenCalledWith({
      userId: user.id,
      type: 'LOGIN',
      ipAddress: undefined,
      userAgent: undefined,
    });
  },
);
});
