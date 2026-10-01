import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { UserService } from './user.service.js';

import {
  PASSWORD_RESET_REPOSITORY,
  type IPasswordResetRepository,
} from '../../domain/repositories/password-reset.repository.js';

import {
  PasswordReset,
} from '../../domain/entities/password-reset.entity.js';

import {
  SESSION_TOKEN_SERVICE,
  type ISessionTokenService,
} from './session-token.service.js';

import {
  FORGOT_PASSWORD_SERVICE,
  type IForgotPasswordService,
} from './forgot-password.service.js';
import { EMAIL_SERVICE, type IEmailService } from './email.service.js';

@Injectable()
export class ForgotPasswordService
  implements IForgotPasswordService
{
 constructor(
  private readonly userService: UserService,

  @Inject(PASSWORD_RESET_REPOSITORY)
  private readonly passwordResetRepository:
    IPasswordResetRepository,

  @Inject(SESSION_TOKEN_SERVICE)
  private readonly sessionTokenService:
    ISessionTokenService,

  @Inject(EMAIL_SERVICE)
  private readonly emailService:
    IEmailService,
) {}

  async requestReset(
    email: string,
  ): Promise<PasswordReset | null> {
    const user =
      await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const existingReset =
      await this.passwordResetRepository
        .findActiveByUserId(user.id);

    if (existingReset) {
      existingReset.revoke();

      await this.passwordResetRepository.update(
        existingReset,
      );
    }

    const rawToken =
      this.sessionTokenService.generate();

    const tokenHash =
      this.sessionTokenService.hash(
        rawToken,
      );

    const expiresAt =
      new Date(
        Date.now() +
          15 * 60 * 1000,
      );
const passwordReset =
  PasswordReset.createNew({
    id: randomUUID(),
    userId: user.id,
    tokenHash,
    expiresAt,
  });

await this.passwordResetRepository.create(
  passwordReset,
);

const resetUrl =
  `${process.env['FRONTEND_URL']}/reset-password?token=${encodeURIComponent(rawToken)}`;

await this.emailService.send({
  to: user.email,
  subject: 'Reset your SmartDM AI password',
  html: `
    <h2>Reset your password</h2>

    <p>
      We received a request to reset your SmartDM AI password.
    </p>

    <p>
      Click the button below to choose a new password:
    </p>

    <p>
      <a
        href="${resetUrl}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Reset Password
      </a>
    </p>

    <p>
      This link will expire in 15 minutes.
    </p>

    <p>
      If you did not request a password reset,
      you can safely ignore this email.
    </p>
  `,
});

return passwordReset;
  }
}