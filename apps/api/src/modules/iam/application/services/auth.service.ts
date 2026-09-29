import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { UserService } from './user.service.js';

import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../domain/repositories/user-credential.repository.js';

import {
  SESSION_REPOSITORY,
  type ISessionRepository,
} from '../../domain/repositories/session.repository.js';

import {
  User,
} from '../../domain/entities/user.entity.js';

import {
  UserCredential,
} from '../../domain/entities/user-credential.entity.js';

import {
  Session,
} from '../../domain/entities/session.entity.js';

import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from './password-hasher.service.js';

import {
  SESSION_TOKEN_SERVICE,
  type ISessionTokenService,
} from './session-token.service.js';

import {
  EmailAlreadyRegisteredError,
} from '../errors/email-already-registered.error.js';

import {
  InvalidCredentialsError,
} from '../errors/invalid-credentials.error.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly credentialRepository: IUserCredentialRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,

    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,

    @Inject(SESSION_TOKEN_SERVICE)
    private readonly sessionTokenService: ISessionTokenService,
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

  async login(params: {
    email: string;
    password: string;
  }): Promise<{
    user: User;
    token: string;
  }> {
    const user =
      await this.userService.findByEmail(
        params.email,
      );

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const credentials =
      await this.credentialRepository.findByUserId(
        user.id,
      );

    if (!credentials) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid =
      await this.passwordHasher.compare(
        params.password,
        credentials.passwordHash,
      );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    user.markLogin();

    await this.userService.update(user);

    const rawToken =
      this.sessionTokenService.generate();

    const tokenHash =
      this.sessionTokenService.hash(
        rawToken,
      );

    const expiresAt =
      new Date(
        Date.now() +
          30 * 24 * 60 * 60 * 1000,
      );

    const session =
      Session.createNew({
        id: randomUUID(),
        userId: user.id,
        tokenHash,
        expiresAt,
      });

    await this.sessionRepository.create(
      session,
    );

    return {
      user,
      token: rawToken,
    };
  }
}