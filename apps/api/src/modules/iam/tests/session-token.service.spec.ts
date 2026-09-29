import { SessionTokenService } from '../infrastructure/security/session-token.service.js';
import {
 
  describe,
  it,
  expect,
} from '@jest/globals';
describe('Session Token Service', () => {
  const service =
    new SessionTokenService();

  it('should generate a random token', () => {
    const token =
      service.generate();

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token).toHaveLength(64);
  });

  it('should generate different tokens', () => {
    const token1 =
      service.generate();

    const token2 =
      service.generate();

    expect(token1).not.toBe(token2);
  });

  it('should hash a token using SHA-256', () => {
    const token = 'test-token';

    const hash =
      service.hash(token);

    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash).toHaveLength(64);
  });

  it('should produce the same hash for the same token', () => {
    const token = 'test-token';

    const hash1 =
      service.hash(token);

    const hash2 =
      service.hash(token);

    expect(hash1).toBe(hash2);
  });
});