export interface PasswordResetProps {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PasswordReset {
  private constructor(
    private readonly props: PasswordResetProps,
  ) {}

  static create(
    props: PasswordResetProps,
  ): PasswordReset {
    return new PasswordReset(props);
  }

  static createNew(params: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): PasswordReset {
    const now = new Date();

    return new PasswordReset({
      id: params.id,
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: params.expiresAt,
      usedAt: null,
      revokedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  isExpired(): boolean {
    return this.props.expiresAt <= new Date();
  }

  isUsed(): boolean {
    return this.props.usedAt !== null;
  }

  isRevoked(): boolean {
    return this.props.revokedAt !== null;
  }

  isValid(): boolean {
    return (
      !this.isExpired() &&
      !this.isUsed() &&
      !this.isRevoked()
    );
  }

  use(): void {
    this.props.usedAt = new Date();
    this.props.updatedAt = new Date();
  }

  revoke(): void {
    this.props.revokedAt = new Date();
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get tokenHash(): string {
    return this.props.tokenHash;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get usedAt(): Date | null {
    return this.props.usedAt;
  }

  get revokedAt(): Date | null {
    return this.props.revokedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}