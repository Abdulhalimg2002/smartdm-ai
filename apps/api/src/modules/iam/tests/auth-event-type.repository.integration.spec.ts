import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals';

import { PrismaAuthEventTypeRepository } from '../infrastructure/persistence/repositories/prisma-auth-event-type.repository.js';

import { db } from '../../../prisma/db.js';

describe('AuthEventType Repository Integration', () => {
  let repository: PrismaAuthEventTypeRepository;

  beforeAll(() => {
    repository =
      new PrismaAuthEventTypeRepository();
  });

  afterAll(async () => {
    await db[Symbol.asyncDispose]();
  });

  it('should find an AuthEventType by code', async () => {
    const result =
      await repository.findByCode('LOGIN');

    expect(result).not.toBeNull();

    expect(result?.code).toBe('LOGIN');
    expect(result?.id).toBeDefined();
    expect(result?.name).toBeDefined();
    expect(result?.isActive).toBe(true);
  });

  it('should return null when AuthEventType does not exist', async () => {
    const result =
      await repository.findByCode(
        'NON_EXISTENT_EVENT',
      );

    expect(result).toBeNull();
  });
});