import { OAuth2Client } from 'google-auth-library';
import { describe, expect, it, jest } from '@jest/globals';

import { GoogleOAuthClient } from '../infrastructure/auth/google/google-oauth.client.js';

describe('GoogleOAuthClient', () => {
  const clientId = 'test-client-id';
  const clientSecret = 'test-client-secret';

  const redirectUri =
    'http://localhost:4000/auth/google/callback';

  it('should generate a Google authorization URL', () => {
    const generateAuthUrlMock =
      jest.fn<
        (options: {
          access_type: 'offline';
          scope: string[];
          prompt: 'select_account';
        }) => string
      >();

    generateAuthUrlMock.mockReturnValue(
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=test-client-id',
    );

    const oauthClient = {
      generateAuthUrl: generateAuthUrlMock,
    } as unknown as OAuth2Client;

    const client = new GoogleOAuthClient(
      {
        clientId,
        clientSecret,
        redirectUri,
      },
      {
        oauthClient,
      },
    );

    const url = client.getAuthorizationUrl();

    expect(url).toContain(
      'https://accounts.google.com',
    );

    expect(url).toContain(
      'client_id=test-client-id',
    );

    expect(
      generateAuthUrlMock,
    ).toHaveBeenCalledWith({
      access_type: 'offline',
      scope: [
        'openid',
        'email',
        'profile',
      ],
      prompt: 'select_account',
    });
  });

  it('should exchange code and return Google user profile', async () => {
    const getTokenMock =
      jest.fn<
        (
          code: string,
        ) => Promise<{
          tokens: {
            id_token?: string;
          };
        }>
      >();

    getTokenMock.mockResolvedValue({
      tokens: {
        id_token: 'fake-id-token',
      },
    });

    const verifyIdTokenMock =
      jest.fn<
        (params: {
          idToken: string;
          audience: string;
        }) => Promise<{
          getPayload: () => {
            sub: string;
            email: string;
            given_name: string;
            family_name: string;
            picture: string;
          };
        }>
      >();

    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => ({
        sub: 'google-user-123',
        email: 'user@gmail.com',
        given_name: 'Abdul',
        family_name: 'Halim',
        email_verified: true,
        picture:
          'https://example.com/avatar.jpg',
      }),
    });

    const oauthClient = {
      getToken: getTokenMock,
      verifyIdToken: verifyIdTokenMock,
    } as unknown as OAuth2Client;

    const client = new GoogleOAuthClient(
      {
        clientId,
        clientSecret,
        redirectUri,
      },
      {
        oauthClient,
      },
    );

    const profile =
      await client.exchangeCodeForProfile(
        'fake-authorization-code',
      );

    expect(getTokenMock).toHaveBeenCalledWith(
      'fake-authorization-code',
    );

    expect(
      verifyIdTokenMock,
    ).toHaveBeenCalledWith({
      idToken: 'fake-id-token',
      audience: clientId,
    });

    expect(profile).toEqual({
      providerUserId: 'google-user-123',
      email: 'user@gmail.com',
      firstName: 'Abdul',
      emailVerified: true,
      lastName: 'Halim',
      avatarUrl:
        'https://example.com/avatar.jpg',
    });
  });

  it('should reject when Google does not return an ID token', async () => {
    const getTokenMock =
      jest.fn<
        (
          code: string,
        ) => Promise<{
          tokens: {
            id_token?: string;
          };
        }>
      >();

    getTokenMock.mockResolvedValue({
      tokens: {},
    });

    const oauthClient = {
      getToken: getTokenMock,
    } as unknown as OAuth2Client;

    const client = new GoogleOAuthClient(
      {
        clientId,
        clientSecret,
        redirectUri,
      },
      {
        oauthClient,
      },
    );

    await expect(
      client.exchangeCodeForProfile(
        'fake-authorization-code',
      ),
    ).rejects.toThrow(
      'Google ID token was not returned',
    );
  });

  it('should reject when Google profile is missing', async () => {
    const getTokenMock =
      jest.fn<
        (
          code: string,
        ) => Promise<{
          tokens: {
            id_token?: string;
          };
        }>
      >();

    getTokenMock.mockResolvedValue({
      tokens: {
        id_token: 'fake-id-token',
      },
    });

    const verifyIdTokenMock =
      jest.fn<
        (params: {
          idToken: string;
          audience: string;
        }) => Promise<{
          getPayload: () => undefined;
        }>
      >();

    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => undefined,
    });

    const oauthClient = {
      getToken: getTokenMock,
      verifyIdToken: verifyIdTokenMock,
    } as unknown as OAuth2Client;

    const client = new GoogleOAuthClient(
      {
        clientId,
        clientSecret,
        redirectUri,
      },
      {
        oauthClient,
      },
    );

    await expect(
      client.exchangeCodeForProfile(
        'fake-authorization-code',
      ),
    ).rejects.toThrow(
      'Google user profile not found',
    );
  });
});