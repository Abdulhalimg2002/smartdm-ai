import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  Session,
} from '../domain/entities/session.entity.js';

describe('Session Entity', () => {
  const createSession = (
    overrides?: Partial<{
      expiresAt: Date;
      revokedAt: Date | null;
    }>,
  ): Session => {
    return Session.create({
      id: 'session-1',
      userId: 'user-1',
      tokenHash: 'hashed-token',
      ipAddress: null,
      userAgent: null,
      lastActivityAt: new Date(),
      expiresAt:
        overrides?.expiresAt ??
        new Date(
          Date.now() + 60_000,
        ),
      revokedAt:
        overrides?.revokedAt ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };
  it('should revoke a session', () => {
  const session = Session.createNew({
    id: 'session-revoke',
    userId: 'user-1',
    tokenHash: 'hashed-token',
    expiresAt: new Date(Date.now() + 60_000),
  });

  const previousUpdatedAt =
    session.updatedAt;

  session.revoke();

  expect(session.revokedAt).not.toBeNull();
  expect(session.isRevoked()).toBe(true);
  expect(session.isValid()).toBe(false);
  expect(session.updatedAt.getTime())
    .toBeGreaterThanOrEqual(
      previousUpdatedAt.getTime(),
    );
});

  it('should not be revoked when revokedAt is null', () => {
    const session =
      createSession();

    expect(
      session.isRevoked(),
    ).toBe(false);
  });

  it('should be revoked when revokedAt is set', () => {
    const session =
      createSession({
        revokedAt: new Date(),
      });

    expect(
      session.isRevoked(),
    ).toBe(true);
  });

  it('should not be expired when expiresAt is in the future', () => {
    const session =
      createSession({
        expiresAt:
          new Date(
            Date.now() + 60_000,
          ),
      });

    expect(
      session.isExpired(),
    ).toBe(false);
  });

  it('should be expired when expiresAt is in the past', () => {
    const session =
      createSession({
        expiresAt:
          new Date(
            Date.now() - 60_000,
          ),
      });

    expect(
      session.isExpired(),
    ).toBe(true);
  });

  it('should be valid when session is not revoked or expired', () => {
    const session =
      createSession();

    expect(
      session.isValid(),
    ).toBe(true);
  });

  it('should be invalid when session is revoked', () => {
    const session =
      createSession({
        revokedAt: new Date(),
      });

    expect(
      session.isValid(),
    ).toBe(false);
  });

  it('should be invalid when session is expired', () => {
    const session =
      createSession({
        expiresAt:
          new Date(
            Date.now() - 60_000,
          ),
      });

    expect(
      session.isValid(),
    ).toBe(false);
  });
});