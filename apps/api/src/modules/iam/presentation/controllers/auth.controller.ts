import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '../../application/services/auth.service.js';


import { RegisterDto } from '../../application/dto/register.dto.js';
import { EmailAlreadyRegisteredError } from '../../application/errors/email-already-registered.error.js';
import { UserResponseDto } from '../../application/dto/user-response.dto.js';
import { InvalidCredentialsError } from '../../application/errors/invalid-credentials.error.js';
import { LoginDto } from '../../application/dto/login.dto.js';
import { SessionAuthGuard } from '../guards/session-auth.guard.js';
import { type ILogoutService, LOGOUT_SERVICE } from '../../application/services/logout.service.js';
import {
  REVOKE_SESSION_SERVICE,
  type IRevokeSessionService,
} from '../../application/services/revoke-session.service.js';
import { User } from '../../domain/entities/user.entity.js';
import { InvalidSessionError } from '../../application/errors/invalid-session.error.js';
import type { Request } from 'express';
import { FORGOT_PASSWORD_SERVICE,type IForgotPasswordService } from '../../application/services/forgot-password.service.js';
import { ForgotPasswordDto } from '../../application/dto/forgot-password.dto.js';
import { type IResetPasswordService, RESET_PASSWORD_SERVICE } from '../../application/services/reset-password.service.js';
import { ResetPasswordDto } from '../../application/dto/reset-password.dto.js';
import { GOOGLE_OAUTH_CLIENT, type IGoogleOAuthClient } from '../../domain/services/google-oauth.client.js';
import { GOOGLE_AUTH_SERVICE, type IGoogleAuthService } from '../../application/services/google-auth.service.js';
import { GoogleEmailNotVerifiedError } from '../../application/errors/google-email-not-verified.error.js';
type AuthenticatedRequest = Request & {
  token: string;
  user: User;
};

@Controller('auth')
export class AuthController {
 constructor(
  private readonly authService: AuthService,

  @Inject(LOGOUT_SERVICE)
  private readonly logoutService: ILogoutService,

  @Inject(REVOKE_SESSION_SERVICE)
  private readonly revokeSessionService: IRevokeSessionService,
  @Inject(FORGOT_PASSWORD_SERVICE)
private readonly forgotPasswordService:
  IForgotPasswordService,
  @Inject(RESET_PASSWORD_SERVICE)
private readonly resetPasswordService:
  IResetPasswordService,
  @Inject(GOOGLE_OAUTH_CLIENT)
  private readonly googleOAuthClient:
    IGoogleOAuthClient,
    @Inject(GOOGLE_AUTH_SERVICE)
private readonly googleAuthService:
  IGoogleAuthService,
) {}


 @Post('register')
@HttpCode(200)
async register(
  @Body() dto: RegisterDto,
  @Req() request: Request,
) {
  try {
    const user =
      await this.authService.register({
        email: dto.email,
        password: dto.password,
        firstName: dto.firstName,
        lastName: dto.lastName,
        ipAddress: request.ip,
        userAgent: request.get('user-agent') ?? null,
      });

    return UserResponseDto.fromEntity(user);
  } catch (error) {
    if (
      error instanceof EmailAlreadyRegisteredError
    ) {
      throw new ConflictException(
        error.message,
      );
    }

    throw error;
  }
}
 @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
  ) {
    try {
      const result =
        await this.authService.login({
          email: dto.email,
          password: dto.password,
        ipAddress: request.ip,
    userAgent: request.get('user-agent') ?? null,
        });

      return {
        user: UserResponseDto.fromEntity(
          result.user,
        ),
        token: result.token,
      };
    } catch (error) {
      if (
        error instanceof InvalidCredentialsError
      ) {
        throw new UnauthorizedException(
          error.message,
        );
      }

      throw error;
    }
  }
 
  
  @Get('me')
@UseGuards(SessionAuthGuard)
getMe() {
  return {
    message: 'Authenticated',
  };
}
@Post('sessions/:sessionId/revoke')
@HttpCode(200)
@UseGuards(SessionAuthGuard)
async revokeSession(
  @Param('sessionId') sessionId: string,
  @Req() request: AuthenticatedRequest,
) {
  try {
    await this.revokeSessionService.revokeSession(
      sessionId,
      request.user.id,
    );

    return {
      message: 'Session revoked successfully',
    };
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      throw new UnauthorizedException(
        error.message,
      );
    }

    throw error;
  }
}
@Post('logout')
@HttpCode(200)
@UseGuards(SessionAuthGuard)
async logout(
  @Req() request: AuthenticatedRequest,
) {
  try {
    await this.logoutService.logout({
      token: request.token,
      ipAddress: request.ip,
      userAgent:
        request.get('user-agent') ?? null,
    });

    return {
      message: 'Logged out successfully',
    };
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      throw new UnauthorizedException(
        error.message,
      );
    }

    throw error;
  }
}
@Post('forgot-password')
@HttpCode(200)
async forgotPassword(
  @Body() dto: ForgotPasswordDto,
  @Req() request: Request,
) {
  await this.forgotPasswordService.requestReset({
    email: dto.email,
    ipAddress: request.ip,
    userAgent:
      request.get('user-agent') ?? null,
  });

  return {
    message:
      'If an account exists with this email, a password reset link has been sent.',
  };
}
@Post('reset-password')
@HttpCode(200)
async resetPassword(
  @Body() dto: ResetPasswordDto,
  @Req() request: Request,
) {
  await this.resetPasswordService.resetPassword({
    token: dto.token,
    newPassword: dto.newPassword,
    ipAddress: request.ip,
    userAgent:
      request.get('user-agent') ?? null,
  });

  return {
    message:
      'Password has been reset successfully.',
  };
}
@Get('google')
async googleLogin() {
  return {
    url:
      this.googleOAuthClient
        .getAuthorizationUrl(),
  };
}
@Get('google/callback')
async googleCallback(
  @Query('code') code: string,
  @Req() request: Request,
) {
  try {
    const result =
      await this.googleAuthService.loginWithCode({
        code,
        ipAddress: request.ip ?? null,
        userAgent:
          request.get('user-agent') ?? null,
      });

    return {
      user: UserResponseDto.fromEntity(
        result.user,
      ),
      token: result.token,
    };
  } catch (error) {
    if (
      error instanceof GoogleEmailNotVerifiedError
    ) {
      throw new ForbiddenException(
        error.message,
      );
    }

    throw error;
  }
}



}