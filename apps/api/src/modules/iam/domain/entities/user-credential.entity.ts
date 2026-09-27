export interface UserCredentialProps {
  id: string;
  userId: string;
  passwordHash: string;
  passwordChangedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserCredential {
  private constructor(
    private readonly props: UserCredentialProps,
  ) {}

  static create(props: UserCredentialProps): UserCredential {
    return new UserCredential(props);
  }

  static createNew(params: {
    id: string;
    userId: string;
    passwordHash: string;
  }): UserCredential {
    const now = new Date();

    return new UserCredential({
      id: params.id,
      userId: params.userId,
      passwordHash: params.passwordHash,
      passwordChangedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get passwordChangedAt(): Date | null {
    return this.props.passwordChangedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}