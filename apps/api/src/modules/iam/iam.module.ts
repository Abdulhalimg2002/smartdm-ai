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
import { SESSION_REPOSITORY } from './domain/repositories/session.repository.js';
import { PrismaSessionRepository } from './infrastructure/persistence/repositories/prisma-session.repository.js';
import { UserService } from './application/services/user.service.js';
import { AuthService } from './application/services/auth.service.js';
import { PASSWORD_HASHER } from './application/services/password-hasher.service.js';
import { Argon2PasswordHasher } from './infrastructure/security/argon2-password-hasher.js';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { SESSION_TOKEN_SERVICE } from './application/services/session-token.service.js';
import { SessionTokenService } from './infrastructure/security/session-token.service.js';
import { SESSION_VALIDATION_SERVICE } from './application/services/session-validation.service.js';
import { SessionValidationService } from './application/services/session-validation.service.impl.js';
import { LOGOUT_SERVICE } from './application/services/logout.service.js';
import { LogoutService } from './application/services/logout.service.impl.js';

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
  provide: SESSION_VALIDATION_SERVICE,
  useClass: SessionValidationService,
},
{
  provide: LOGOUT_SERVICE,
  useClass: LogoutService,
},
  ],
  exports: [
    USER_REPOSITORY,
    USER_CREDENTIAL_REPOSITORY,
    SESSION_REPOSITORY,    
    SESSION_VALIDATION_SERVICE,
     LOGOUT_SERVICE,
     UserService,
    AuthService,
  ],
  
})
export class IamModule {}