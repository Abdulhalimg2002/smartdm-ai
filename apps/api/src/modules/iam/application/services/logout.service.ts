export const LOGOUT_SERVICE =
  Symbol('LOGOUT_SERVICE');

export interface ILogoutService {
logout(params: {
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<void>;
}