import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { AuthProvider } from '../domain/entities/auth-provider.entity.js';

import {
  AuthProviderService,
} from '../application/services/auth-provider.service.js';

import {
  type IAuthProviderRepository,
} from '../domain/repositories/auth-provider.repository.js';

describe('AuthProviderService', () => {
  const repository: jest.Mocked<IAuthProviderRepository> = {
    findById: jest.fn(),
    findByCode: jest.fn(),
    findAllActive: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const service =
    new AuthProviderService(repository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createEntity = () =>
    AuthProvider.createNew({
      id: crypto.randomUUID(),
      name: 'Google',
      code: 'GOOGLE',
      description: 'Google OAuth',
      sortOrder: 2,
    });

  it('should find an auth provider by id', async () => {
    const provider = createEntity();

    repository.findById
      .mockResolvedValue(provider);

    const result =
      await service.findById(provider.id);

    expect(result).toBe(provider);

    expect(
      repository.findById,
    ).toHaveBeenCalledWith(provider.id);
  });

  it('should find an auth provider by code', async () => {
    const provider = createEntity();

    repository.findByCode
      .mockResolvedValue(provider);

    const result =
      await service.findByCode('GOOGLE');

    expect(result).toBe(provider);

    expect(
      repository.findByCode,
    ).toHaveBeenCalledWith('GOOGLE');
  });

  it('should find all active auth providers', async () => {
    const google = createEntity();

    const local = AuthProvider.createNew({
      id: crypto.randomUUID(),
      name: 'Local',
      code: 'LOCAL',
    });

    repository.findAllActive
      .mockResolvedValue([
        google,
        local,
      ]);

    const result =
      await service.findAllActive();

    expect(result).toEqual([
      google,
      local,
    ]);

    expect(
      repository.findAllActive,
    ).toHaveBeenCalledTimes(1);
  });

  it('should create a new auth provider', async () => {
    const provider = createEntity();

    repository.findByCode
      .mockResolvedValue(null);

    repository.create
      .mockResolvedValue(provider);

    const result =
      await service.create({
        id: provider.id,
        name: provider.name,
        code: provider.code,
        description: provider.description,
        sortOrder: provider.sortOrder,
      });

    expect(result).toBe(provider);

    expect(
      repository.findByCode,
    ).toHaveBeenCalledWith(
      provider.code,
    );

    expect(
      repository.create,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return existing provider instead of creating duplicate', async () => {
    const existing = createEntity();

    repository.findByCode
      .mockResolvedValue(existing);

    const result =
      await service.create({
        id: crypto.randomUUID(),
        name: 'Google',
        code: 'GOOGLE',
      });

    expect(result).toBe(existing);

    expect(
      repository.create,
    ).not.toHaveBeenCalled();
  });

  it('should update an auth provider', async () => {
    const provider = createEntity();

    repository.update
      .mockResolvedValue(provider);

    const result =
      await service.update(provider);

    expect(result).toBe(provider);

    expect(
      repository.update,
    ).toHaveBeenCalledWith(provider);
  });

  it('should activate an auth provider', async () => {
    const provider = createEntity();

    provider.deactivate();

    repository.update
      .mockResolvedValue(provider);

    const result =
      await service.activate(provider);

    expect(result).toBe(provider);
    expect(provider.isActive).toBe(true);

    expect(
      repository.update,
    ).toHaveBeenCalledWith(provider);
  });

  it('should deactivate an auth provider', async () => {
    const provider = createEntity();

    repository.update
      .mockResolvedValue(provider);

    const result =
      await service.deactivate(provider);

    expect(result).toBe(provider);
    expect(provider.isActive).toBe(false);

    expect(
      repository.update,
    ).toHaveBeenCalledWith(provider);
  });
});