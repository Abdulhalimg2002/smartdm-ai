export interface GoogleUserProfile {
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

export interface IGoogleOAuthClient {
  getAuthorizationUrl(): string;

  exchangeCodeForProfile(
    code: string,
  ): Promise<GoogleUserProfile>;
}

export const GOOGLE_OAUTH_CLIENT = Symbol(
  'GOOGLE_OAUTH_CLIENT',
);