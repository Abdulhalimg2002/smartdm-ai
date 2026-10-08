import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  beforeEach,
  describe,
  expect,
  it,
 
} from '@jest/globals';
import {
  GOOGLE_AUTH_SERVICE,
} from '../application/services/google-auth.service.js';

import {
  GoogleAuthServiceImpl,
} from '../application/services/google-auth.service.impl.js';

import {
  GOOGLE_OAUTH_CLIENT,
} from '../domain/services/google-oauth.client.js';

import {
  SESSION_SERVICE,
} from '../application/services/session.service.js';

import {
  AUTH_EVENT_SERVICE,
} from '../application/services/auth-event.service.js';

import {
  USER_REPOSITORY,
} from '../domain/repositories/user.repository.js';

import {
  USER_AUTH_PROVIDER_REPOSITORY,
} from '../domain/repositories/user-auth-provider.repository.js';

import {
  AUTH_PROVIDER_REPOSITORY,
} from '../domain/repositories/auth-provider.repository.js';

import {
  UserService,
} from '../application/services/user.service.js';

import {
  UserAuthProviderService,
} from '../application/services/user-auth-provider.service.js';

import {
  AuthProviderService,
} from '../application/services/auth-provider.service.js';

describe('GoogleAuthService DI', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: GOOGLE_AUTH_SERVICE,
          useClass: GoogleAuthServiceImpl,
        },

        {
          provide: GOOGLE_OAUTH_CLIENT,
          useValue: {},
        },

        {
          provide: SESSION_SERVICE,
          useValue: {},
        },

        {
          provide: AUTH_EVENT_SERVICE,
          useValue: {},
        },

        UserService,
        UserAuthProviderService,
        AuthProviderService,

        {
          provide: USER_REPOSITORY,
          useValue: {},
        },

        {
          provide: USER_AUTH_PROVIDER_REPOSITORY,
          useValue: {},
        },

        {
          provide: AUTH_PROVIDER_REPOSITORY,
          useValue: {},
        },
      ],
    }).compile();
  });

  it(
    'should resolve GoogleAuthServiceImpl through GOOGLE_AUTH_SERVICE',
    () => {
      const service =
        module.get(GOOGLE_AUTH_SERVICE);

      expect(service).toBeInstanceOf(
        GoogleAuthServiceImpl,
      );
    },
  );
});