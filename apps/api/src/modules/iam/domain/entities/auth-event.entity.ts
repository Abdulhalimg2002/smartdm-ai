export interface AuthEventProps {
  id: string;
  userId: string | null;
  authEventTypeId: string;
  occurredAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthEvent {
  private constructor(
    private readonly props: AuthEventProps,
  ) {}

  static create(
    props: AuthEventProps,
  ): AuthEvent {
    return new AuthEvent(props);
  }

  static createNew(params: {
    id: string;
    userId?: string | null;
    authEventTypeId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): AuthEvent {
    const now = new Date();

    return new AuthEvent({
      id: params.id,
      userId: params.userId ?? null,
      authEventTypeId:
        params.authEventTypeId,
      occurredAt: now,
      ipAddress:
        params.ipAddress ?? null,
      userAgent:
        params.userAgent ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string | null {
    return this.props.userId;
  }

  get authEventTypeId(): string {
    return this.props.authEventTypeId;
  }

  get occurredAt(): Date {
    return this.props.occurredAt;
  }

  get ipAddress(): string | null {
    return this.props.ipAddress;
  }

  get userAgent(): string | null {
    return this.props.userAgent;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}