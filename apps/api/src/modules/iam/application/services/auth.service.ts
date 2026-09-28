import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { UserService } from './user.service.js';

import {
  USER_CREDENTIAL_REPOSITORY,
} from '../../domain/repositories/user-credential.repository.js';

import type {
  IUserCredentialRepository,
} from '../../domain/repositories/user-credential.repository.js';



import {
  User,
} from '../../domain/entities/user.entity.js';

import {
  UserCredential,
} from '../../domain/entities/user-credential.entity.js';
import  {  PASSWORD_HASHER } from './password-hasher.service.js';
import type{IPasswordHasher} from './password-hasher.service.js';
import { EmailAlreadyRegisteredError } from '../../errors/email-already-registered.error.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly credentialRepository: IUserCredentialRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async register(params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    const existingUser =
      await this.userService.findByEmail(
        params.email,
      );

   if (existingUser) {
  throw new EmailAlreadyRegisteredError();
}

    const userId =
      randomUUID();

    const user =
      User.createNew({
        id: userId,
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
      });

    const passwordHash =
      await this.passwordHasher.hash(
        params.password,
      );

    const credential =
      UserCredential.createNew({
        id: randomUUID(),
        userId: user.id,
        passwordHash,
      });

    await this.userService.create(user);

    await this.credentialRepository.create(
      credential,
    );

    return user;
  }
}