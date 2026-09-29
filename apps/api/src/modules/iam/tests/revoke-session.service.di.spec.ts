import {
  describe,
  it,
  expect,
} from '@jest/globals';

import {
  Test,
} from '@nestjs/testing';

import {
  IamModule,
} from '../iam.module.js';

import {
  REVOKE_SESSION_SERVICE,
  type IRevokeSessionService,
} from '../application/services/revoke-session.service.js';

describe('RevokeSessionService DI', () => {
  it('should resolve RevokeSessionService from IamModule', async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    const service =
      moduleRef.get<IRevokeSessionService>(
        REVOKE_SESSION_SERVICE,
      );

    expect(service).toBeDefined();
  });
});