import { UserAuthProvider } from '../entities/user-auth-provider.entity.js';

export const USER_AUTH_PROVIDER_REPOSITORY = Symbol(
  'USER_AUTH_PROVIDER_REPOSITORY',
);

export interface IUserAuthProviderRepository {
  findById(
    id: string,
  ): Promise<UserAuthProvider | null>;

  findByUserAndProvider(
    userId: string,
    authProviderId: string,
  ): Promise<UserAuthProvider | null>;

  findByProviderUserId(
    authProviderId: string,
    providerUserId: string,
  ): Promise<UserAuthProvider | null>;

  create(
    userAuthProvider: UserAuthProvider,
  ): Promise<UserAuthProvider>;

  update(
    userAuthProvider: UserAuthProvider,
  ): Promise<UserAuthProvider>;
}