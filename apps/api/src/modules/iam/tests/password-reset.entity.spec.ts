import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  PasswordReset,
} from '../domain/entities/password-reset.entity.js';

describe('PasswordReset Entity', () => {
  const createReset = (
    overrides: Partial<{
      expiresAt: Date;
      usedAt: Date | null;
      revokedAt: Date | null;
    }> = {},
  ) => {
    return PasswordReset.create({
      id: 'reset-id',
      userId: 'user-id',
      tokenHash: 'hashed-token',
      expiresAt:
        overrides.expiresAt ??
        new Date(Date.now() + 15 * 60 * 1000),
      usedAt:
        overrides.usedAt ?? null,
      revokedAt:
        overrides.revokedAt ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  it('should create a valid password reset', () => {
    const reset = createReset();

    expect(reset.isExpired()).toBe(false);
    expect(reset.isUsed()).toBe(false);
    expect(reset.isRevoked()).toBe(false);
    expect(reset.isValid()).toBe(true);
  });

  it('should detect an expired password reset', () => {
    const reset = createReset({
      expiresAt: new Date(Date.now() - 1000),
    });

    expect(reset.isExpired()).toBe(true);
    expect(reset.isValid()).toBe(false);
  });

  it('should detect a used password reset', () => {
    const reset = createReset({
      usedAt: new Date(),
    });

    expect(reset.isUsed()).toBe(true);
    expect(reset.isValid()).toBe(false);
  });

  it('should detect a revoked password reset', () => {
    const reset = createReset({
      revokedAt: new Date(),
    });

    expect(reset.isRevoked()).toBe(true);
    expect(reset.isValid()).toBe(false);
  });

  it('should mark the password reset as used', () => {
    const reset = createReset();

    reset.use();

    expect(reset.usedAt).not.toBeNull();
    expect(reset.isUsed()).toBe(true);
    expect(reset.isValid()).toBe(false);
  });

  it('should mark the password reset as revoked', () => {
    const reset = createReset();

    reset.revoke();

    expect(reset.revokedAt).not.toBeNull();
    expect(reset.isRevoked()).toBe(true);
    expect(reset.isValid()).toBe(false);
  });
});