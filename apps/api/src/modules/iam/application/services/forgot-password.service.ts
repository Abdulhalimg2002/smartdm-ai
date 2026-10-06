import {
  PasswordReset,
} from '../../domain/entities/password-reset.entity.js';

export const FORGOT_PASSWORD_SERVICE =
  Symbol('FORGOT_PASSWORD_SERVICE');

export interface IForgotPasswordService {
  requestReset(params: {
    email: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<PasswordReset | null>;
}