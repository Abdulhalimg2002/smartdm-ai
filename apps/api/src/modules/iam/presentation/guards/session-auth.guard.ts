import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  SESSION_VALIDATION_SERVICE,
  type ISessionValidationService,
} from '../../application/services/session-validation.service.js';

import {
  Session,
} from '../../domain/entities/session.entity.js';

import {
  User,
} from '../../domain/entities/user.entity.js';

import {
  InvalidSessionError,
} from '../../application/errors/invalid-session.error.js';

import type { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: User;
  session: Session;
token: string;
};

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    @Inject(SESSION_VALIDATION_SERVICE)
    private readonly sessionValidationService: ISessionValidationService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization =
      request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'Invalid session',
      );
    }

    const [scheme, token] =
      authorization.split(' ');

    if (
      scheme !== 'Bearer' ||
      !token
    ) {
      throw new UnauthorizedException(
        'Invalid session',
      );
    }

    try {
      const result =
        await this.sessionValidationService.validate(
          token,
        );

      request.user = result.user;
      request.session = result.session;
      request.token = token;

      return true;
    } catch (error) {
      if (
        error instanceof InvalidSessionError
      ) {
        throw new UnauthorizedException(
          'Invalid session',
        );
      }

      throw error;
    }
  }
}