import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  Argon2PasswordHasher,
} from '../infrastructure/security/argon2-password-hasher.js';

describe('IAM Password Hasher', () => {
  const hasher =
    new Argon2PasswordHasher();

  it('should hash a password', async () => {
    const password =
      'StrongPassword123!';

    const hash =
      await hasher.hash(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it('should verify the correct password', async () => {
    const password =
      'StrongPassword123!';

    const hash =
      await hasher.hash(password);

    const result =
      await hasher.compare(
        password,
        hash,
      );

    expect(result).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const password =
      'StrongPassword123!';

    const hash =
      await hasher.hash(password);

    const result =
      await hasher.compare(
        'WrongPassword123!',
        hash,
      );

    expect(result).toBe(false);
  });

  it('should generate different hashes for the same password', async () => {
    const password =
      'StrongPassword123!';

    const hash1 =
      await hasher.hash(password);

    const hash2 =
      await hasher.hash(password);

    expect(hash1).not.toBe(hash2);
  });
});