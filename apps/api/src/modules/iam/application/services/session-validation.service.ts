import {
  Session,
} from '../../domain/entities/session.entity.js';

import {
  User,
} from '../../domain/entities/user.entity.js';

export const SESSION_VALIDATION_SERVICE =
  Symbol('SESSION_VALIDATION_SERVICE');

export interface ISessionValidationService {
  validate(token: string): Promise<{
    session: Session;
    user: User;
  }>;
}