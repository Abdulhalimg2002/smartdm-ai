import { afterEach, describe, expect, it } from '@jest/globals';

import {
  getGoogleOAuthConfig,
} from '../infrastructure/auth/google/google-oauth.config.js';

describe('GoogleOAuthConfig', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return Google OAuth configuration', () => {
    process.env.GOOGLE_CLIENT_ID =
      'test-client-id';

    process.env.GOOGLE_CLIENT_SECRET =
      'test-client-secret';

    process.env.GOOGLE_CALLBACK_URL =
      'http://localhost:4000/auth/google/callback';

    expect(
      getGoogleOAuthConfig(),
    ).toEqual({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri:
        'http://localhost:4000/auth/google/callback',
    });
  });

  it('should throw when client ID is missing', () => {
    delete process.env.GOOGLE_CLIENT_ID;

    process.env.GOOGLE_CLIENT_SECRET =
      'test-client-secret';

    process.env.GOOGLE_CALLBACK_URL =
      'http://localhost:4000/auth/google/callback';

    expect(() =>
      getGoogleOAuthConfig(),
    ).toThrow(
      'GOOGLE_CLIENT_ID is not configured',
    );
  });

  it('should throw when client secret is missing', () => {
    process.env.GOOGLE_CLIENT_ID =
      'test-client-id';

    delete process.env.GOOGLE_CLIENT_SECRET;

    process.env.GOOGLE_CALLBACK_URL =
      'http://localhost:4000/auth/google/callback';

    expect(() =>
      getGoogleOAuthConfig(),
    ).toThrow(
      'GOOGLE_CLIENT_SECRET is not configured',
    );
  });

  it('should throw when callback URL is missing', () => {
    process.env.GOOGLE_CLIENT_ID =
      'test-client-id';

    process.env.GOOGLE_CLIENT_SECRET =
      'test-client-secret';

    delete process.env.GOOGLE_CALLBACK_URL;

    expect(() =>
      getGoogleOAuthConfig(),
    ).toThrow(
      'GOOGLE_CALLBACK_URL is not configured',
    );
  });
});