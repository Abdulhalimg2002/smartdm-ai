import { AuthEventType } from '../entities/auth-event-type.entity.js';

export const AUTH_EVENT_TYPE_REPOSITORY = Symbol(
  'AUTH_EVENT_TYPE_REPOSITORY',
);

export interface IAuthEventTypeRepository {
  findByCode(
    code: string,
  ): Promise<AuthEventType | null>;
}