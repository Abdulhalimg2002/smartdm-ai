export class UserCannotAuthenticateError
  extends Error
{
  constructor() {
    super(
      'User cannot authenticate',
    );

    this.name =
      'UserCannotAuthenticateError';
  }
}