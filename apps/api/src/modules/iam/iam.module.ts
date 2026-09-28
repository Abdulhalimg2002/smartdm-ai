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
  ],
  exports: [
    USER_REPOSITORY,
    USER_CREDENTIAL_REPOSITORY,
    SESSION_REPOSITORY,
    UserService,
    AuthService
  ],
  
})
export class IamModule {}