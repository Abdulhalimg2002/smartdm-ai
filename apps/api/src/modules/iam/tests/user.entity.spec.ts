import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  User,
  UserStatus,
} from '../domain/entities/user.entity.js';

describe('User Entity', () => {
  it('should update lastLoginAt when user logs in', () => {
    const user = User.createNew({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
    });

    expect(user.lastLoginAt).toBeNull();

    user.markLogin();

    expect(user.lastLoginAt).not.toBeNull();
    expect(user.lastLoginAt).toBeInstanceOf(Date);
  });

  it('should update updatedAt when user logs in', () => {
    const user = User.createNew({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
    });

    const beforeUpdate = user.updatedAt;

    user.markLogin();

    expect(user.updatedAt.getTime())
      .toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
  });

  it('should verify the user email', () => {
    const user = User.createNew({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
    });

    expect(user.emailVerifiedAt).toBeNull();

    user.verifyEmail();

    expect(user.emailVerifiedAt).not.toBeNull();
    expect(user.emailVerifiedAt).toBeInstanceOf(Date);
  });

  it('should update updatedAt when email is verified', () => {
    const user = User.createNew({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
    });

    const beforeUpdate = user.updatedAt;

    user.verifyEmail();

    expect(user.updatedAt.getTime())
      .toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
  });

  it('should allow authentication when user is active', () => {
    const user = User.createNew({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
    });

    expect(user.status).toBe(UserStatus.ACTIVE);
    expect(user.canAuthenticate()).toBe(true);
  });

  it('should not allow authentication when user is inactive', () => {
    const user = User.create({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
      status: UserStatus.INACTIVE,
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(user.canAuthenticate()).toBe(false);
  });

  it('should not allow authentication when user is suspended', () => {
    const user = User.create({
      id: 'user-1',
      email: 'abdul@example.com',
      firstName: 'Abdul',
      lastName: 'Halim',
      status: UserStatus.SUSPENDED,
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(user.canAuthenticate()).toBe(false);
  });
});