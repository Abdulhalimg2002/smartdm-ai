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
  LOGOUT_SERVICE,
  type ILogoutService,
} from '../application/services/logout.service.js';

describe('LogoutService DI', () => {
  it('should resolve LogoutService from IamModule', async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    const service =
      moduleRef.get<ILogoutService>(
        LOGOUT_SERVICE,
      );

    expect(service).toBeDefined();
  });
});