export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export const getGoogleOAuthConfig =
  (): GoogleOAuthConfig => {
    const clientId =
      process.env.GOOGLE_CLIENT_ID;

    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET;

    const redirectUri =
      process.env.GOOGLE_CALLBACK_URL;

    if (!clientId) {
      throw new Error(
        'GOOGLE_CLIENT_ID is not configured',
      );
    }

    if (!clientSecret) {
      throw new Error(
        'GOOGLE_CLIENT_SECRET is not configured',
      );
    }

    if (!redirectUri) {
      throw new Error(
        'GOOGLE_CALLBACK_URL is not configured',
      );
    }

    return {
      clientId,
      clientSecret,
      redirectUri,
    };
  };