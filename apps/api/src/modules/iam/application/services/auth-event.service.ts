import { AuthEvent } from '../../domain/entities/auth-event.entity.js';

export const AUTH_EVENT_SERVICE = Symbol(
  'AUTH_EVENT_SERVICE',
);

export interface IAuthEventService {
  record(params: {
    userId?: string | null;
    type: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<AuthEvent>;
}