import { AuthProvider } from '../entities/auth-provider.entity.js';

export const AUTH_PROVIDER_REPOSITORY = Symbol(
  'AUTH_PROVIDER_REPOSITORY',
);

export interface IAuthProviderRepository {
  findById(
    id: string,
  ): Promise<AuthProvider | null>;

  findByCode(
    code: string,
  ): Promise<AuthProvider | null>;

  findAllActive(): Promise<AuthProvider[]>;

  create(
    authProvider: AuthProvider,
  ): Promise<AuthProvider>;

  update(
    authProvider: AuthProvider,
  ): Promise<AuthProvider>;
}