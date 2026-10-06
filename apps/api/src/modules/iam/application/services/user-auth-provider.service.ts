import { Inject, Injectable } from '@nestjs/common';

import { UserAuthProvider } from '../../domain/entities/user-auth-provider.entity.js';

import {
  USER_AUTH_PROVIDER_REPOSITORY,
  type IUserAuthProviderRepository,
} from '../../domain/repositories/user-auth-provider.repository.js';

@Injectable()
export class UserAuthProviderService {
  constructor(
    @Inject(USER_AUTH_PROVIDER_REPOSITORY)
    private readonly repository: IUserAuthProviderRepository,
  ) {}

  async findById(
    id: string,
  ): Promise<UserAuthProvider | null> {
    return this.repository.findById(id);
  }

  async findByUserAndProvider(
    userId: string,
    authProviderId: string,
  ): Promise<UserAuthProvider | null> {
    return this.repository.findByUserAndProvider(
      userId,
      authProviderId,
    );
  }

  async findByProviderUserId(
    authProviderId: string,
    providerUserId: string,
  ): Promise<UserAuthProvider | null> {
    return this.repository.findByProviderUserId(
      authProviderId,
      providerUserId,
    );
  }

  async linkProvider(params: {
    id: string;
    userId: string;
    authProviderId: string;
    providerUserId?: string | null;
    providerEmail?: string | null;
  }): Promise<UserAuthProvider> {
    const existing =
      await this.repository.findByUserAndProvider(
        params.userId,
        params.authProviderId,
      );

    if (existing) {
      return existing;
    }

    const userAuthProvider =
      UserAuthProvider.createNew(params);

    return this.repository.create(
      userAuthProvider,
    );
  }

  async markUsed(
    userAuthProvider: UserAuthProvider,
  ): Promise<UserAuthProvider> {
    userAuthProvider.markUsed();

    return this.repository.update(
      userAuthProvider,
    );
  }

  async deactivate(
    userAuthProvider: UserAuthProvider,
  ): Promise<UserAuthProvider> {
    userAuthProvider.deactivate();

    return this.repository.update(
      userAuthProvider,
    );
  }

  async activate(
    userAuthProvider: UserAuthProvider,
  ): Promise<UserAuthProvider> {
    userAuthProvider.activate();

    return this.repository.update(
      userAuthProvider,
    );
  }
}