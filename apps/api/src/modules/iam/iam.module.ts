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

@Module({
  providers: [
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
  ],
  exports: [
    USER_REPOSITORY,
    USER_CREDENTIAL_REPOSITORY,
    SESSION_REPOSITORY,
  ],
  
})
export class IamModule {}