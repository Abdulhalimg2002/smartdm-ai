export interface AuthProviderProps {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthProvider {
  private constructor(
    private readonly props: AuthProviderProps,
  ) {}

  static create(
    props: AuthProviderProps,
  ): AuthProvider {
    return new AuthProvider(props);
  }

  static createNew(params: {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    sortOrder?: number;
  }): AuthProvider {
    const now = new Date();

    return new AuthProvider({
      id: params.id,
      name: params.name,
      code: params.code,
      description: params.description ?? null,
      isActive: true,
      sortOrder: params.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  updateDetails(params: {
    name?: string;
    description?: string | null;
    sortOrder?: number;
  }): void {
    if (params.name !== undefined) {
      this.props.name = params.name;
    }

    if (params.description !== undefined) {
      this.props.description = params.description;
    }

    if (params.sortOrder !== undefined) {
      this.props.sortOrder = params.sortOrder;
    }

    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get code(): string {
    return this.props.code;
  }

  get description(): string | null {
    return this.props.description;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}