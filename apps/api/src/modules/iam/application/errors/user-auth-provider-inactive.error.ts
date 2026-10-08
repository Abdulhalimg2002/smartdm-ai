export class UserAuthProviderInactiveError
  extends Error
{
  constructor() {
    super(
      'User authentication provider is inactive',
    );

    this.name =
      'UserAuthProviderInactiveError';
  }
}