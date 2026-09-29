export const LOGOUT_SERVICE =
  Symbol('LOGOUT_SERVICE');

export interface ILogoutService {
  logout(token: string): Promise<void>;
}