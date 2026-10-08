export class AuthProviderInactiveError extends Error {
  constructor() {
    super('Authentication provider is inactive');
    this.name = 'AuthProviderInactiveError';
  }
}