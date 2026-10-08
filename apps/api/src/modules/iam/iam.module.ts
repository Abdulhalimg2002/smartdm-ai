import { Module } from '@nestjs/common';

import {
  USER_REPOSITORY,
} from './domain/repositories/user.repository.js';

import {
  USER_CREDENTIAL_REPOSITORY,
} from './domain/repositories/user-credential.repository.js';

import {
  PrismaUserRepository,
} from './infrastructure/persistence/repositories/prisma-user.repository.js';

import {
  PrismaUserCredentialRepository,
} from './infrastructure/persistence/repositories/prisma-user-credential.repository.js';

import {
  SESSION_REPOSITORY,
} from './domain/repositories/session.repository.js';

import {
  PrismaSessionRepository,
} from './infrastructure/persistence/repositories/prisma-session.repository.js';

import {
  UserService,
} from './application/services/user.service.js';

import {
  AuthService,
} from './application/services/auth.service.js';

import {
  PASSWORD_HASHER,
} from './application/services/password-hasher.service.js';

import {
  Argon2PasswordHasher,
} from './infrastructure/security/argon2-password-hasher.js';

import {
  AuthController,
} from './presentation/controllers/auth.controller.js';

import {
  SESSION_TOKEN_SERVICE,
} from './application/services/session-token.service.js';

import {
  SessionTokenService,
} from './infrastructure/security/session-token.service.js';

import {
  SESSION_SERVICE,
  SessionService,
} from './application/services/session.service.js';

import {
  SESSION_VALIDATION_SERVICE,
} from './application/services/session-validation.service.js';

import {
  SessionValidationService,
} from './application/services/session-validation.service.impl.js';

import {
  LOGOUT_SERVICE,
} from './application/services/logout.service.js';

import {
  LogoutService,
} from './application/services/logout.service.impl.js';

import {
  REVOKE_SESSION_SERVICE,
} from './application/services/revoke-session.service.js';

import {
  RevokeSessionService,
} from './application/services/revoke-session.service.impl.js';

import {
  PASSWORD_RESET_REPOSITORY,
} from './domain/repositories/password-reset.repository.js';

import {
  PrismaPasswordResetRepository,
} from './infrastructure/persistence/repositories/prisma-password-reset.repository.js';

import {
  FORGOT_PASSWORD_SERVICE,
} from './application/services/forgot-password.service.js';

import {
  ForgotPasswordService,
} from './application/services/forgot-password.service.impl.js';

import {
  RESET_PASSWORD_SERVICE,
} from './application/services/reset-password.service.js';

import {
  ResetPasswordService,
} from './application/services/reset-password.service.impl.js';

import {
  EMAIL_SERVICE,
} from './application/services/email.service.js';

import {
  NodemailerEmailService,
} from './infrastructure/email/nodemailer-email.service.js';

import {
  AUTH_EVENT_REPOSITORY,
} from './domain/repositories/auth-event.repository.js';

import {
  PrismaAuthEventRepository,
} from './infrastructure/persistence/repositories/prisma-auth-event.repository.js';

import {
  AUTH_EVENT_SERVICE,
} from './application/services/auth-event.service.js';

import {
  AuthEventService,
} from './application/services/auth-event.service.impl.js';

import {
  AUTH_EVENT_TYPE_REPOSITORY,
} from './domain/repositories/auth-event-type.repository.js';

import {
  PrismaAuthEventTypeRepository,
} from './infrastructure/persistence/repositories/prisma-auth-event-type.repository.js';

import {
  USER_AUTH_PROVIDER_REPOSITORY,
} from './domain/repositories/user-auth-provider.repository.js';

import {
  PrismaUserAuthProviderRepository,
} from './infrastructure/persistence/repositories/prisma-user-auth-provider.repository.js';

import {
  UserAuthProviderService,
} from './application/services/user-auth-provider.service.js';

import {
  AuthProviderService,
} from './application/services/auth-provider.service.js';

import {
  AUTH_PROVIDER_REPOSITORY,
} from './domain/repositories/auth-provider.repository.js';

import {
  PrismaAuthProviderRepository,
} from './infrastructure/persistence/repositories/prisma-auth-provider.repository.js';

import {
  GOOGLE_OAUTH_CLIENT,
} from './domain/services/google-oauth.client.js';

import {
  getGoogleOAuthConfig,
} from './infrastructure/auth/google/google-oauth.config.js';

import {
  GoogleOAuthClient,
} from './infrastructure/auth/google/google-oauth.client.js';
import { GOOGLE_AUTH_SERVICE } from './application/services/google-auth.service.js';
import { GoogleAuthServiceImpl } from './application/services/google-auth.service.impl.js';

@Module({
  controllers: [
    AuthController,
  ],

  providers: [
    UserService,

    AuthService,

    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },

    {
      provide: USER_CREDENTIAL_REPOSITORY,
      useClass: PrismaUserCredentialRepository,
    },

    {
      provide: SESSION_REPOSITORY,
      useClass: PrismaSessionRepository,
    },

    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },

    {
      provide: SESSION_TOKEN_SERVICE,
      useClass: SessionTokenService,
    },

    {
      provide: SESSION_SERVICE,
      useClass: SessionService,
    },

    {
      provide: SESSION_VALIDATION_SERVICE,
      useClass: SessionValidationService,
    },

    {
      provide: LOGOUT_SERVICE,
      useClass: LogoutService,
    },

    {
      provide: REVOKE_SESSION_SERVICE,
      useClass: RevokeSessionService,
    },

    {
      provide: PASSWORD_RESET_REPOSITORY,
      useClass: PrismaPasswordResetRepository,
    },

    {
      provide: FORGOT_PASSWORD_SERVICE,
      useClass: ForgotPasswordService,
    },

    {
      provide: RESET_PASSWORD_SERVICE,
      useClass: ResetPasswordService,
    },

    {
      provide: EMAIL_SERVICE,
      useClass: NodemailerEmailService,
    },

    {
      provide: AUTH_EVENT_REPOSITORY,
      useClass: PrismaAuthEventRepository,
    },

    {
      provide: AUTH_EVENT_SERVICE,
      useClass: AuthEventService,
    },

    {
      provide: AUTH_EVENT_TYPE_REPOSITORY,
      useClass: PrismaAuthEventTypeRepository,
    },

    {
      provide: USER_AUTH_PROVIDER_REPOSITORY,
      useClass: PrismaUserAuthProviderRepository,
    },

    {
      provide: AUTH_PROVIDER_REPOSITORY,
      useClass: PrismaAuthProviderRepository,
    },

    {
      provide: GOOGLE_OAUTH_CLIENT,
      useFactory: () => {
        const config =
          getGoogleOAuthConfig();

        return new GoogleOAuthClient({
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          redirectUri: config.redirectUri,
        });
      },
    },
    {
  provide: GOOGLE_AUTH_SERVICE,
  useClass: GoogleAuthServiceImpl,
},

    UserAuthProviderService,

    AuthProviderService,
  ],

  exports: [
    USER_REPOSITORY,
    USER_CREDENTIAL_REPOSITORY,
    SESSION_REPOSITORY,
    SESSION_VALIDATION_SERVICE,
    LOGOUT_SERVICE,
    REVOKE_SESSION_SERVICE,
    FORGOT_PASSWORD_SERVICE,
    RESET_PASSWORD_SERVICE,
    USER_AUTH_PROVIDER_REPOSITORY,
    GOOGLE_OAUTH_CLIENT,
    UserService,
    AuthService,
    UserAuthProviderService,
    AuthProviderService,
  ],
})
export class IamModule {}