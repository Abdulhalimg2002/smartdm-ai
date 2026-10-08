export class AuthProviderNotFoundError
  extends Error
{
  constructor() {
    super(
      'Google authentication provider not found',
    );

    this.name =
      'AuthProviderNotFoundError';
  }
}