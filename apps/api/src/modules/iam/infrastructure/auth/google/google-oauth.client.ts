import { OAuth2Client } from 'google-auth-library';

import {
  type GoogleUserProfile,
  type IGoogleOAuthClient,
} from '../../../domain/services/google-oauth.client.js';

export interface GoogleOAuthClientOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GoogleOAuthClientDependencies {
  oauthClient: OAuth2Client;
}

export class GoogleOAuthClient
  implements IGoogleOAuthClient
{
  private readonly clientId: string;
  private readonly oauthClient: OAuth2Client;

  constructor(
    options: GoogleOAuthClientOptions,
    dependencies?: GoogleOAuthClientDependencies,
  ) {
    this.clientId = options.clientId;

    this.oauthClient =
      dependencies?.oauthClient ??
      new OAuth2Client(
        options.clientId,
        options.clientSecret,
        options.redirectUri,
      );
  }

  getAuthorizationUrl(): string {
    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'openid',
        'email',
        'profile',
      ],
      prompt: 'select_account',
    });
  }

  async exchangeCodeForProfile(
    code: string,
  ): Promise<GoogleUserProfile> {
    const { tokens } =
      await this.oauthClient.getToken(code);

    if (!tokens.id_token) {
      throw new Error(
        'Google ID token was not returned',
      );
    }

    const ticket =
      await this.oauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: this.clientId,
      });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error(
        'Google user profile not found',
      );
    }

    if (!payload.sub) {
      throw new Error(
        'Google user ID not found',
      );
    }

    if (!payload.email) {
      throw new Error(
        'Google email not found',
      );
    }

    return {
      providerUserId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified ?? false,
      firstName: payload.given_name ?? null,
      lastName: payload.family_name ?? null,
      avatarUrl: payload.picture ?? null,
    };
  }
}