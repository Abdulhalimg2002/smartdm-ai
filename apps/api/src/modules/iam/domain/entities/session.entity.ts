export interface SessionProps {
  id: string;
  userId: string;
  tokenHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  lastActivityAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Session {
  private constructor(
    private readonly props: SessionProps,
  ) {}

  static create(props: SessionProps): Session {
    return new Session(props);
  }

  static createNew(params: {
    id: string;
    userId: string;
    tokenHash: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    expiresAt: Date;
  }): Session {
    const now = new Date();

    return new Session({
      id: params.id,
      userId: params.userId,
      tokenHash: params.tokenHash,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
      lastActivityAt: now,
      expiresAt: params.expiresAt,
      revokedAt: null,
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

  get tokenHash(): string {
    return this.props.tokenHash;
  }

  get ipAddress(): string | null {
    return this.props.ipAddress;
  }

  get userAgent(): string | null {
    return this.props.userAgent;
  }

  get lastActivityAt(): Date {
    return this.props.lastActivityAt;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
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