import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { Test } from '@nestjs/testing';

import {
  AUTH_EVENT_SERVICE,
  IAuthEventService,
} from '../application/services/auth-event.service.js';

import { IamModule } from '../iam.module.js';

describe('AuthEventService DI', () => {
  it('should resolve AuthEventService from IamModule', async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    const authEventService =
      moduleRef.get<IAuthEventService>(
        AUTH_EVENT_SERVICE,
      );

    expect(authEventService).toBeDefined();
  });
});