export const EMAIL_SERVICE =
  Symbol('EMAIL_SERVICE');

export interface IEmailService {
  send(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void>;
}