import { PasswordReset } from '../entities/password-reset.entity.js';

export const PASSWORD_RESET_REPOSITORY = Symbol(
  'PASSWORD_RESET_REPOSITORY',
);

export interface IPasswordResetRepository {
  findById(id: string): Promise<PasswordReset | null>;

  findByTokenHash(
    tokenHash: string,
  ): Promise<PasswordReset | null>;

  findActiveByUserId(
    userId: string,
  ): Promise<PasswordReset | null>;

  create(
    passwordReset: PasswordReset,
  ): Promise<PasswordReset>;

  update(
    passwordReset: PasswordReset,
  ): Promise<PasswordReset>;
}