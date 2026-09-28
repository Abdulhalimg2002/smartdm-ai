import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { User } from '../../domain/entities/user.entity.js';

import {
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.js';

import type {
  IUserRepository,
} from '../../domain/repositories/user.repository.js';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  async update(user: User): Promise<User> {
    return this.userRepository.update(user);
  }
}