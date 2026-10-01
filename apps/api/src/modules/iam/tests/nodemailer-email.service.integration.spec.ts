import 'dotenv/config';

import {
  describe,
  expect,
  it,
} from '@jest/globals';

import {
  NodemailerEmailService,
} from '../infrastructure/email/nodemailer-email.service.js';

describe('NodemailerEmailService Integration', () => {
  it('should send an email successfully', async () => {
    const service =
      new NodemailerEmailService();

    await expect(
      service.send({
        to: process.env['EMAIL_USER']!,
        subject:
          'SmartDM AI - Email Service Test',
        html: `
          <h1>SmartDM AI</h1>
          <p>
            Email service is working successfully.
          </p>
        `,
      }),
    ).resolves.toBeUndefined();
  });
});