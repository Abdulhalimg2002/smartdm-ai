import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { UserService } from './user.service.js';

import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../domain/repositories/user-credential.repository.js';

import {
  User,
} from '../../domain/entities/user.entity.js';

import {
  UserCredential,
} from '../../domain/entities/user-credential.entity.js';

import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from './password-hasher.service.js';

import {
  SESSION_SERVICE,
  type ISessionService,
} from './session.service.js';

import {
  EmailAlreadyRegisteredError,
} from '../errors/email-already-registered.error.js';

import {
  InvalidCredentialsError,
} from '../errors/invalid-credentials.error.js';

import {
  AUTH_EVENT_SERVICE,
  type IAuthEventService,
} from './auth-event.service.js';

import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly credentialRepository:
      IUserCredentialRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher:
      IPasswordHasher,

    @Inject(SESSION_SERVICE)
    private readonly sessionService:
      ISessionService,

    @Inject(AUTH_EVENT_SERVICE)
    private readonly authEventService:
      IAuthEventService,
  ) {}

  async register(params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    ipAddress?: string | null;
    userAgent?: string | null;
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

    await this.authEventService.record({
      userId: user.id,
      type: 'REGISTER',
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });

    return user;
  }

  async login(params: {
    email: string;
    password: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<{
    user: User;
    token: string;
  }> {
    const user =
      await this.userService.findByEmail(
        params.email,
      );

    if (!user) {
      await this.authEventService.record({
        userId: null,
        type: 'LOGIN_FAILED',
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });

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
      await this.authEventService.record({
        userId: user.id,
        type: 'LOGIN_FAILED',
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });

      throw new InvalidCredentialsError();
    }

    user.markLogin();

    await this.userService.update(user);

    const { token } =
      await this.sessionService.create({
        userId: user.id,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });

    await this.authEventService.record({
      userId: user.id,
      type: 'LOGIN',
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });

    return {
      user,
      token,
    };
  }
}