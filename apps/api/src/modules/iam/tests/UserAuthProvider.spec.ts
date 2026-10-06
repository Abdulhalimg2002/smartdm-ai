import { Test } from '@nestjs/testing';
import { describe, expect, it } from '@jest/globals';

import { IamModule } from '../iam.module.js';

import {
  USER_AUTH_PROVIDER_REPOSITORY,
} from '../domain/repositories/user-auth-provider.repository.js';

import {
  PrismaUserAuthProviderRepository,
} from '../infrastructure/persistence/repositories/prisma-user-auth-provider.repository.js';
import { UserAuthProviderService } from '../application/services/user-auth-provider.service.js';
import { AuthProviderService } from '../application/services/auth-provider.service.js';
import { GOOGLE_OAUTH_CLIENT } from '../domain/services/google-oauth.client.js';
import { GoogleOAuthClient } from '../infrastructure/auth/google/google-oauth.client.js';
import { SESSION_SERVICE, SessionService } from '../application/services/session.service.js';

describe('IAM Module DI', () => {
  it('should resolve UserAuthProvider repository', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IamModule],
    }).compile();

    const repository = moduleRef.get(
      USER_AUTH_PROVIDER_REPOSITORY,
    );

    expect(repository).toBeInstanceOf(
      PrismaUserAuthProviderRepository,
    );

    await moduleRef.close();
  });
});
describe('UserAuthProviderService DI', () => {
  it('should resolve UserAuthProviderService', async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    const service =
      moduleRef.get(UserAuthProviderService);

    expect(service).toBeInstanceOf(
      UserAuthProviderService,
    );

    await moduleRef.close();
  });
});
describe('AuthProviderService DI', () => {
  it('should resolve AuthProviderService', async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    const service =
      moduleRef.get(AuthProviderService);

    expect(service).toBeInstanceOf(
      AuthProviderService,
    );

    await moduleRef.close();
  });
});
describe('GoogleOAuthClient DI', () => {
  it('should resolve GoogleOAuthClient', async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    const client =
      moduleRef.get(GOOGLE_OAUTH_CLIENT);

    expect(client).toBeInstanceOf(
      GoogleOAuthClient,
    );

    await moduleRef.close();
  });
});
describe('SessionService DI', () => {
  it('should resolve SessionService', async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    const service =
      moduleRef.get(SESSION_SERVICE);

    expect(service).toBeInstanceOf(
      SessionService,
    );

    await moduleRef.close();
  });
});