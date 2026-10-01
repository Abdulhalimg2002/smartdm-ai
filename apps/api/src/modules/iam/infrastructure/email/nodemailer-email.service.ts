import {
  Injectable,
} from '@nestjs/common';

import {
  createTransport,
  type Transporter,
} from 'nodemailer';

import type {
  IEmailService,
} from '../../application/services/email.service.js';

@Injectable()
export class NodemailerEmailService
  implements IEmailService
{
  private readonly transporter:
    Transporter;

  constructor() {
    this.transporter =
      createTransport({
        host: process.env['EMAIL_HOST'],
        port: Number(
          process.env['EMAIL_PORT'],
        ),
        secure: false,
        auth: {
          user:
            process.env['EMAIL_USER'],
          pass:
            process.env['EMAIL_PASS'],
        },
      });
  }

  async send(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from:
        process.env['EMAIL_FROM'],
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  }
}