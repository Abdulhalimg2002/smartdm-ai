import { describe, expect, it, jest ,beforeEach} from '@jest/globals';

import { UserAuthProvider } from '../domain/entities/user-auth-provider.entity.js';

import {
  UserAuthProviderService,
} from '../application/services/user-auth-provider.service.js';

import {
  type IUserAuthProviderRepository,
} from '../domain/repositories/user-auth-provider.repository.js';

describe('UserAuthProviderService', () => {
  const repository: jest.Mocked<IUserAuthProviderRepository> = {
    findById: jest.fn(),
    findByUserAndProvider: jest.fn(),
    findByProviderUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const service =
    new UserAuthProviderService(repository);
    beforeEach(() => {
  jest.clearAllMocks();
});

  const createEntity = () =>
    UserAuthProvider.createNew({
      id: crypto.randomUUID(),
      userId: crypto.randomUUID(),
      authProviderId: crypto.randomUUID(),
      providerUserId: 'google-user-123',
      providerEmail: 'test@gmail.com',
    });

  it('should find a UserAuthProvider by id', async () => {
    const entity = createEntity();

    repository.findById.mockResolvedValue(entity);

    const result =
      await service.findById(entity.id);

    expect(result).toBe(entity);

    expect(
      repository.findById,
    ).toHaveBeenCalledWith(entity.id);
  });

  it('should find a UserAuthProvider by user and provider', async () => {
    const entity = createEntity();

    repository.findByUserAndProvider
      .mockResolvedValue(entity);

    const result =
      await service.findByUserAndProvider(
        entity.userId,
        entity.authProviderId,
      );

    expect(result).toBe(entity);

    expect(
      repository.findByUserAndProvider,
    ).toHaveBeenCalledWith(
      entity.userId,
      entity.authProviderId,
    );
  });

  it('should find a UserAuthProvider by provider user id', async () => {
    const entity = createEntity();

    repository.findByProviderUserId
      .mockResolvedValue(entity);

    const result =
      await service.findByProviderUserId(
        entity.authProviderId,
        entity.providerUserId!,
      );

    expect(result).toBe(entity);

    expect(
      repository.findByProviderUserId,
    ).toHaveBeenCalledWith(
      entity.authProviderId,
      entity.providerUserId!,
    );
  });

  it('should create a new provider link', async () => {
    const entity = createEntity();

    repository.findByUserAndProvider
      .mockResolvedValue(null);

    repository.create
      .mockResolvedValue(entity);

    const result =
      await service.linkProvider({
        id: entity.id,
        userId: entity.userId,
        authProviderId: entity.authProviderId,
        providerUserId: entity.providerUserId,
        providerEmail: entity.providerEmail,
      });

    expect(result).toBe(entity);

    expect(
      repository.findByUserAndProvider,
    ).toHaveBeenCalledWith(
      entity.userId,
      entity.authProviderId,
    );

    expect(
      repository.create,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return existing provider link instead of creating duplicate', async () => {
    const existing = createEntity();

    repository.findByUserAndProvider
      .mockResolvedValue(existing);

    const result =
      await service.linkProvider({
        id: crypto.randomUUID(),
        userId: existing.userId,
        authProviderId: existing.authProviderId,
        providerUserId: 'another-google-id',
        providerEmail: 'another@gmail.com',
      });

    expect(result).toBe(existing);

    expect(
      repository.create,
    ).not.toHaveBeenCalled();
  });

  it('should mark provider as used and update it', async () => {
    const entity = createEntity();

    repository.update
      .mockResolvedValue(entity);

    const result =
      await service.markUsed(entity);

    expect(result).toBe(entity);

    expect(entity.lastUsedAt).not.toBeNull();

    expect(
      repository.update,
    ).toHaveBeenCalledWith(entity);
  });

  it('should deactivate and activate provider', async () => {
    const entity = createEntity();

    repository.update
      .mockResolvedValue(entity);

    await service.deactivate(entity);

    expect(entity.isActive).toBe(false);

    expect(
      repository.update,
    ).toHaveBeenCalledWith(entity);

    await service.activate(entity);

    expect(entity.isActive).toBe(true);

    expect(
      repository.update,
    ).toHaveBeenCalledWith(entity);
  });
});