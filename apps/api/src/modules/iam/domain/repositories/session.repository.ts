import { Session } from '../entities/session.entity.js';

export const SESSION_REPOSITORY = Symbol(
  'SESSION_REPOSITORY',
);

export interface ISessionRepository {
  findById(id: string): Promise<Session | null>;

  findByTokenHash(
    tokenHash: string,
  ): Promise<Session | null>;

  create(session: Session): Promise<Session>;

  update(session: Session): Promise<Session>;
  revokeAllByUserId(
  userId: string,
): Promise<void>;
}