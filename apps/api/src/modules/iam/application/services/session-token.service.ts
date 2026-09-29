export const SESSION_TOKEN_SERVICE = Symbol(
  'SESSION_TOKEN_SERVICE',
);

export interface ISessionTokenService {
  generate(): string;

  hash(token: string): string;
}