import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { Test } from '@nestjs/testing';

import {
  AUTH_EVENT_TYPE_REPOSITORY,
  IAuthEventTypeRepository,
} from '../domain/repositories/auth-event-type.repository.js';

import { IamModule } from '../iam.module.js';

describe('AuthEventType Repository DI', () => {
  it('should resolve AuthEventTypeRepository from IamModule', async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [IamModule],
      }).compile();

    const repository =
      moduleRef.get<IAuthEventTypeRepository>(
        AUTH_EVENT_TYPE_REPOSITORY,
      );

    expect(repository).toBeDefined();
  });
});