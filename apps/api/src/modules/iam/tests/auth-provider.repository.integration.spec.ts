import { db } from '../../../prisma/db.js';

import {
  PrismaAuthProviderRepository,
} from '../infrastructure/persistence/repositories/prisma-auth-provider.repository.js';

import {
  AuthProvider,
} from '../domain/entities/auth-provider.entity.js';

import {
  describe,
  it,
  expect,
  afterAll,
} from '@jest/globals';

describe('AuthProvider Repository Integration', () => {
  const repository =
    new PrismaAuthProviderRepository();

  let createdProviderId: string;

  it('should find an existing provider by code', async () => {
    const provider =
      await repository.findByCode('GOOGLE');

    expect(provider).not.toBeNull();

    expect(provider?.code).toBe('GOOGLE');
    expect(provider?.name).toBe('Google');
    expect(provider?.isActive).toBe(true);
  });

  it('should find an existing provider by id', async () => {
    const provider =
      await repository.findByCode('GOOGLE');

    expect(provider).not.toBeNull();

    const found =
      await repository.findById(
        provider!.id,
      );

    expect(found).not.toBeNull();

    expect(found?.id).toBe(
      provider!.id,
    );
  });

  it('should find all active providers', async () => {
    const providers =
      await repository.findAllActive();

    expect(providers.length).toBeGreaterThan(0);

    expect(
      providers.every(
        (provider) => provider.isActive,
      ),
    ).toBe(true);
  });

  it('should create and update an auth provider', async () => {
    const provider =
      AuthProvider.createNew({
        id: crypto.randomUUID(),
        name: 'Test Provider',
        code: `TEST_${crypto.randomUUID()}`,
        description: 'Integration Test Provider',
        sortOrder: 99,
      });

    const created =
      await repository.create(provider);

    createdProviderId = created.id;

    expect(created.id).toBe(
      provider.id,
    );

    expect(created.code).toBe(
      provider.code,
    );

    expect(created.name).toBe(
      'Test Provider',
    );

    created.updateDetails({
      name: 'Updated Test Provider',
      description: 'Updated Description',
      sortOrder: 100,
    });

    const updated =
      await repository.update(created);

    expect(updated.name).toBe(
      'Updated Test Provider',
    );

    expect(updated.description).toBe(
      'Updated Description',
    );

    expect(updated.sortOrder).toBe(100);
  });

  afterAll(async () => {
    if (createdProviderId) {
      await db.orm.public.AuthProvider
        .where({
          id: createdProviderId,
        })
        .delete();
    }

    await db[Symbol.asyncDispose]();
  });
});