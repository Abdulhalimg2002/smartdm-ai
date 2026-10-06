import { UserAuthProvider } from '../domain/entities/user-auth-provider.entity.js';
import {
  describe,
  it,
  expect,
 
} from '@jest/globals';
describe('UserAuthProvider Entity', () => {
  it('should create a new auth provider link', () => {
    const provider = UserAuthProvider.createNew({
      id: 'provider-1',
      userId: 'user-1',
      authProviderId: 'google-provider',
      providerUserId: 'google-user-123',
      providerEmail: 'user@gmail.com',
    });

    expect(provider.id).toBe('provider-1');
    expect(provider.userId).toBe('user-1');
    expect(provider.authProviderId).toBe(
      'google-provider',
    );
    expect(provider.providerUserId).toBe(
      'google-user-123',
    );
    expect(provider.providerEmail).toBe(
      'user@gmail.com',
    );
    expect(provider.isActive).toBe(true);
    expect(provider.lastUsedAt).toBeNull();
  });

  it('should mark provider as used', () => {
    const provider = UserAuthProvider.createNew({
      id: 'provider-1',
      userId: 'user-1',
      authProviderId: 'google-provider',
    });

    expect(provider.lastUsedAt).toBeNull();

    provider.markUsed();

    expect(provider.lastUsedAt).not.toBeNull();
  });

  it('should deactivate provider', () => {
    const provider = UserAuthProvider.createNew({
      id: 'provider-1',
      userId: 'user-1',
      authProviderId: 'google-provider',
    });

    expect(provider.isActive).toBe(true);

    provider.deactivate();

    expect(provider.isActive).toBe(false);
  });

  it('should activate provider', () => {
    const provider = UserAuthProvider.createNew({
      id: 'provider-1',
      userId: 'user-1',
      authProviderId: 'google-provider',
    });

    provider.deactivate();
    expect(provider.isActive).toBe(false);

    provider.activate();

    expect(provider.isActive).toBe(true);
  });
});