export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface UserProps {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: UserStatus;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props);
  }

  static createNew(params: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  }): User {
    const now = new Date();

    return new User({
      id: params.id,
      email: params.email,
      firstName: params.firstName ?? null,
      lastName: params.lastName ?? null,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get firstName(): string | null {
    return this.props.firstName;
  }

  get lastName(): string | null {
    return this.props.lastName;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get emailVerifiedAt(): Date | null {
    return this.props.emailVerifiedAt;
  }

  get lastLoginAt(): Date | null {
    return this.props.lastLoginAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}