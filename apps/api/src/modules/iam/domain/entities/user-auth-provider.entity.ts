export interface UserAuthProviderProps {
  id: string;
  userId: string;
  authProviderId: string;
  providerUserId: string | null;
  providerEmail: string | null;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserAuthProvider {
  private constructor(
    private readonly props: UserAuthProviderProps,
  ) {}

  static create(
    props: UserAuthProviderProps,
  ): UserAuthProvider {
    return new UserAuthProvider(props);
  }

  static createNew(params: {
    id: string;
    userId: string;
    authProviderId: string;
    providerUserId?: string | null;
    providerEmail?: string | null;
  }): UserAuthProvider {
    const now = new Date();

    return new UserAuthProvider({
      id: params.id,
      userId: params.userId,
      authProviderId: params.authProviderId,
      providerUserId: params.providerUserId ?? null,
      providerEmail: params.providerEmail ?? null,
      isActive: true,
      lastUsedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  markUsed(): void {
    this.props.lastUsedAt = new Date();
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get authProviderId(): string {
    return this.props.authProviderId;
  }

  get providerUserId(): string | null {
    return this.props.providerUserId;
  }

  get providerEmail(): string | null {
    return this.props.providerEmail;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get lastUsedAt(): Date | null {
    return this.props.lastUsedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}