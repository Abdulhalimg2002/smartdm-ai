export const REVOKE_SESSION_SERVICE =
  Symbol('REVOKE_SESSION_SERVICE');

export interface IRevokeSessionService {
  revokeSession(
    sessionId: string,
    userId: string,
  ): Promise<void>;
}