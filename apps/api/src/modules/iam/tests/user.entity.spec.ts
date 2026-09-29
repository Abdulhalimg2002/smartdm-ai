
import {
  describe,
  expect,
  it,

} from '@jest/globals';
import {
  User,
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
});