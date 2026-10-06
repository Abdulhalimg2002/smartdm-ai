import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { AuthProvider } from '../domain/entities/auth-provider.entity.js';

describe('AuthProvider Entity', () => {
  it('should create a new auth provider', () => {
    const provider = AuthProvider.createNew({
      id: crypto.randomUUID(),
      name: 'Google',
      code: 'GOOGLE',
      description: 'Google OAuth',
      sortOrder: 2,
    });

    expect(provider.id).toBeDefined();
    expect(provider.name).toBe('Google');
    expect(provider.code).toBe('GOOGLE');
    expect(provider.description).toBe('Google OAuth');
    expect(provider.isActive).toBe(true);
    expect(provider.sortOrder).toBe(2);
  });

  it('should create a provider with default values', () => {
    const provider = AuthProvider.createNew({
      id: crypto.randomUUID(),
      name: 'Local',
      code: 'LOCAL',
    });

    expect(provider.description).toBeNull();
    expect(provider.isActive).toBe(true);
    expect(provider.sortOrder).toBe(0);
  });

  it('should deactivate an auth provider', () => {
    const provider = AuthProvider.createNew({
      id: crypto.randomUUID(),
      name: 'Google',
      code: 'GOOGLE',
    });

    provider.deactivate();

    expect(provider.isActive).toBe(false);
  });

  it('should activate an auth provider', () => {
    const provider = AuthProvider.createNew({
      id: crypto.randomUUID(),
      name: 'Google',
      code: 'GOOGLE',
    });

    provider.deactivate();
    provider.activate();

    expect(provider.isActive).toBe(true);
  });

  it('should update provider details', () => {
    const provider = AuthProvider.createNew({
      id: crypto.randomUUID(),
      name: 'Google',
      code: 'GOOGLE',
      description: 'Google OAuth',
      sortOrder: 2,
    });

    provider.updateDetails({
      name: 'Google OAuth',
      description: 'Google Authentication',
      sortOrder: 1,
    });

    expect(provider.name).toBe('Google OAuth');
    expect(provider.description).toBe(
      'Google Authentication',
    );
    expect(provider.sortOrder).toBe(1);
  });
});