import {
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from '../../application/services/auth.service.js';

import { RegisterDto } from '../../application/dto/register.dto.js';
import { EmailAlreadyRegisteredError } from '../../errors/email-already-registered.error.js';
import { UserResponseDto } from '../../application/dto/user-response.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

 @Post('register')
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
}