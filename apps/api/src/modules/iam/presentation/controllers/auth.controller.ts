import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
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
) {}


 @Post('register')
 @HttpCode(200)
async register(
  @Body() dto: RegisterDto,
) {
  try {
    const user =
      await this.authService.register({
        email: dto.email,
        password: dto.password,
        firstName: dto.firstName,
        lastName: dto.lastName,
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
  ) {
    try {
      const result =
        await this.authService.login({
          email: dto.email,
          password: dto.password,
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
  @Post('logout')
  @HttpCode(200)
  @UseGuards(SessionAuthGuard)
  async logout(
    @Req() request: AuthenticatedRequest,
  ) {
    await this.logoutService.logout(
      request.token,
    );

    return {
      message: 'Logged out successfully',
    };
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
@Post('forgot-password')
@HttpCode(200)
async forgotPassword(
  @Body() dto: ForgotPasswordDto,
) {
  await this.forgotPasswordService.requestReset(
    dto.email,
  );

  return {
    message:
      'If an account exists with this email, a password reset link has been sent.',
  };
}
@Post('reset-password')
@HttpCode(200)
async resetPassword(
  @Body() dto: ResetPasswordDto,
) {
  await this.resetPasswordService.resetPassword({
    token: dto.token,
    newPassword: dto.newPassword,
  });

  return {
    message:
      'Password has been reset successfully.',
  };
}


}