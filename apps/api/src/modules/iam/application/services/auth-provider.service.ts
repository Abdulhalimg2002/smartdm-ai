import { Inject, Injectable } from '@nestjs/common';

import { AuthProvider } from '../../domain/entities/auth-provider.entity.js';

import {
  AUTH_PROVIDER_REPOSITORY,
  type IAuthProviderRepository,
} from '../../domain/repositories/auth-provider.repository.js';

@Injectable()
export class AuthProviderService {
  constructor(
    @Inject(AUTH_PROVIDER_REPOSITORY)
    private readonly repository: IAuthProviderRepository,
  ) {}

  async findById(
    id: string,
  ): Promise<AuthProvider | null> {
    return this.repository.findById(id);
  }

  async findByCode(
    code: string,
  ): Promise<AuthProvider | null> {
    return this.repository.findByCode(code);
  }

  async findAllActive(): Promise<AuthProvider[]> {
    return this.repository.findAllActive();
  }

  async create(params: {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    sortOrder?: number;
  }): Promise<AuthProvider> {
    const existing =
      await this.repository.findByCode(
        params.code,
      );

    if (existing) {
      return existing;
    }

    const authProvider =
      AuthProvider.createNew(params);

    return this.repository.create(
      authProvider,
    );
  }

  async update(
    authProvider: AuthProvider,
  ): Promise<AuthProvider> {
    return this.repository.update(
      authProvider,
    );
  }

  async activate(
    authProvider: AuthProvider,
  ): Promise<AuthProvider> {
    authProvider.activate();

    return this.repository.update(
      authProvider,
    );
  }

  async deactivate(
    authProvider: AuthProvider,
  ): Promise<AuthProvider> {
    authProvider.deactivate();

    return this.repository.update(
      authProvider,
    );
  }
}