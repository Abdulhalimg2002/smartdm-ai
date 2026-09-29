import {
  Test,
} from '@nestjs/testing';

import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  IamModule,
} from '../iam.module.js';

import {
  SESSION_VALIDATION_SERVICE,
} from '../application/services/session-validation.service.js';

describe('IAM Session Validation DI', () => {
  it('should resolve SessionValidationService from IamModule', async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [
          IamModule,
        ],
      }).compile();

    const service =
      moduleRef.get(
        SESSION_VALIDATION_SERVICE,
      );

    expect(service).toBeDefined();
  });
});