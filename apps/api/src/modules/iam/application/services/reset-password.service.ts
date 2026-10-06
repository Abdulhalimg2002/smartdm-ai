export const RESET_PASSWORD_SERVICE =
  Symbol('RESET_PASSWORD_SERVICE');

export interface IResetPasswordService {
  resetPassword(params: {
    token: string;
    newPassword: string;
    ipAddress?: string | null;
  userAgent?: string | null;
  }): Promise<void>;
}