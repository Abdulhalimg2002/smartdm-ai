import { User } from '../../domain/entities/user.entity.js';

export const GOOGLE_AUTH_SERVICE = Symbol(
  'GOOGLE_AUTH_SERVICE',
);

export interface IGoogleAuthService {
  loginWithCode(params: {
    code: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<{
    user: User;
    token: string;
  }>;
}