import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Inject,
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

type AuthenticatedRequest = Request & {
  token: string;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(LOGOUT_SERVICE)
  private readonly logoutService: ILogoutService,
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

}