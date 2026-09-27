import { UserCredential } from '../entities/user-credential.entity.js';

export const USER_CREDENTIAL_REPOSITORY = Symbol(
  'USER_CREDENTIAL_REPOSITORY',
);

export interface IUserCredentialRepository {
  findByUserId(userId: string): Promise<UserCredential | null>;

  create(credentials: UserCredential): Promise<UserCredential>;

  update(credentials: UserCredential): Promise<UserCredential>;
}