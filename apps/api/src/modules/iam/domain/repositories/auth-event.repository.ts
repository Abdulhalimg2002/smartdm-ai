import { AuthEvent } from '../entities/auth-event.entity.js';

export const AUTH_EVENT_REPOSITORY = Symbol(
  'AUTH_EVENT_REPOSITORY',
);

export interface IAuthEventRepository {
  findById(
    id: string,
  ): Promise<AuthEvent | null>;

  create(
    authEvent: AuthEvent,
  ): Promise<AuthEvent>;

  findByUserId(
    userId: string,
  ): Promise<AuthEvent[]>;
}