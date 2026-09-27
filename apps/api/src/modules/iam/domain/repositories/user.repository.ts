import { User } from '../entities/user.entity.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  create(user: User): Promise<User>;

  update(user: User): Promise<User>;
}