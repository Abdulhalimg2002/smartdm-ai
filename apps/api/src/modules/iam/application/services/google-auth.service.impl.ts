import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { User } from '../../domain/entities/user.entity.js';
import { AuthProvider } from '../../domain/entities/auth-provider.entity.js';
import { UserAuthProvider } from '../../domain/entities/user-auth-provider.entity.js';

import {
  GOOGLE_OAUTH_CLIENT,
  type IGoogleOAuthClient,
} from '../../domain/services/google-oauth.client.js';

import {
  SESSION_SERVICE,
  type ISessionService,
} from './session.service.js';

import {
  AUTH_EVENT_SERVICE,
  type IAuthEventService,
} from './auth-event.service.js';

import {
  GOOGLE_AUTH_SERVICE,
  type IGoogleAuthService,
} from './google-auth.service.js';

import {
  GoogleEmailNotVerifiedError,
} from '../errors/google-email-not-verified.error.js';

import {
  UserCannotAuthenticateError,
} from '../errors/user-cannot-authenticate.error.js';

import {
  AuthProviderNotFoundError,
} from '../errors/auth-provider-not-found.error.js';

import {
  AuthProviderInactiveError,
} from '../errors/auth-provider-inactive.error.js';

import {
  UserAuthProviderInactiveError,
} from '../errors/user-auth-provider-inactive.error.js';

import {
  UserService,
} from './user.service.js';

import {
  AuthProviderService,
} from './auth-provider.service.js';

import {
  UserAuthProviderService,
} from './user-auth-provider.service.js';


export interface IGoogleAuthUserService {
  findById(id: string): Promise<User | null>;

  findByEmail(
    email: string,
  ): Promise<User | null>;

  create(
    user: User,
  ): Promise<User>;

  update(
    user: User,
  ): Promise<User>;
}


export interface IGoogleAuthProviderService {
  findByCode(
    code: string,
  ): Promise<AuthProvider | null>;
}


export interface IGoogleAuthProviderLinkService {
  findByProviderUserId(
    authProviderId: string,
    providerUserId: string,
  ): Promise<UserAuthProvider | null>;

  linkProvider(params: {
    id: string;
    userId: string;
    authProviderId: string;
    providerUserId?: string | null;
    providerEmail?: string | null;
  }): Promise<UserAuthProvider>;

  markUsed(
    userAuthProvider: UserAuthProvider,
  ): Promise<UserAuthProvider>;
}


@Injectable()
export class GoogleAuthServiceImpl
  implements IGoogleAuthService
{
  constructor(
    @Inject(GOOGLE_OAUTH_CLIENT)
    private readonly googleOAuthClient: IGoogleOAuthClient,

    @Inject(UserService)
    private readonly userService: IGoogleAuthUserService,

    @Inject(AuthProviderService)
    private readonly authProviderService: IGoogleAuthProviderService,

    @Inject(UserAuthProviderService)
    private readonly userAuthProviderService: IGoogleAuthProviderLinkService,

    @Inject(SESSION_SERVICE)
    private readonly sessionService: ISessionService,

    @Inject(AUTH_EVENT_SERVICE)
    private readonly authEventService: IAuthEventService,
  ) {}

  async loginWithCode(params: {
    code: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<{
    user: User;
    token: string;
  }> {

    // --------------------------------------------------
    // 1. Exchange Google authorization code
    // --------------------------------------------------

    const profile =
      await this.googleOAuthClient.exchangeCodeForProfile(
        params.code,
      );


    // --------------------------------------------------
    // 2. Google email must be verified
    // --------------------------------------------------

    if (!profile.emailVerified) {
      throw new GoogleEmailNotVerifiedError();
    }


    // --------------------------------------------------
    // 3. Find Google authentication provider
    // --------------------------------------------------

    const googleProvider =
      await this.authProviderService.findByCode(
        'GOOGLE',
      );

    if (!googleProvider) {
      throw new AuthProviderNotFoundError();
    }


    // --------------------------------------------------
    // 4. Google authentication provider must be active
    // --------------------------------------------------

    if (!googleProvider.isActive) {
      throw new AuthProviderInactiveError();
    }


    // --------------------------------------------------
    // 5. Check whether this Google account
    //    is already linked to a user
    // --------------------------------------------------

    const existingProviderLink =
      await this.userAuthProviderService.findByProviderUserId(
        googleProvider.id,
        profile.providerUserId,
      );


    let user: User;
    let userAuthProvider: UserAuthProvider;


    // ==================================================
    // EXISTING GOOGLE LINK
    // ==================================================

    if (existingProviderLink) {

      // ------------------------------------------------
      // 6. Google -> User link must be active
      // ------------------------------------------------

      if (!existingProviderLink.isActive) {
        throw new UserAuthProviderInactiveError();
      }


      // ------------------------------------------------
      // 7. Find linked user
      // ------------------------------------------------

      const existingUser =
        await this.userService.findById(
          existingProviderLink.userId,
        );

      if (!existingUser) {
        throw new Error(
          'User linked to Google account was not found',
        );
      }


      user = existingUser;

      userAuthProvider =
        existingProviderLink;
    }

    // ==================================================
    // NO EXISTING GOOGLE LINK
    // ==================================================

    else {

      // ------------------------------------------------
      // 8. Search for existing user by Google email
      // ------------------------------------------------

      const existingUser =
        await this.userService.findByEmail(
          profile.email,
        );


      // ------------------------------------------------
      // 9. Existing user
      // ------------------------------------------------

      if (existingUser) {

        // ----------------------------------------------
        // User must be allowed to authenticate BEFORE
        // modifying or linking the account.
        // ----------------------------------------------

        if (!existingUser.canAuthenticate()) {
          throw new UserCannotAuthenticateError();
        }


        // ----------------------------------------------
        // Google has verified the email
        // ----------------------------------------------

        existingUser.verifyEmail();


        user =
          await this.userService.update(
            existingUser,
          );
      }

      // ------------------------------------------------
      // 10. User does not exist -> create new user
      // ------------------------------------------------

      else {

        const newUser =
          User.createNew({
            id: randomUUID(),
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
          });


        // Google verified the email
        newUser.verifyEmail();


        user =
          await this.userService.create(
            newUser,
          );
      }


      // ------------------------------------------------
      // 11. Link Google account to the user
      // ------------------------------------------------

      userAuthProvider =
        await this.userAuthProviderService.linkProvider({
          id: randomUUID(),
          userId: user.id,
          authProviderId: googleProvider.id,
          providerUserId:
            profile.providerUserId,
          providerEmail:
            profile.email,
        });
    }


    // --------------------------------------------------
    // 12. Final authentication check
    //
    // This also protects the already-linked-account path.
    // --------------------------------------------------

    if (!user.canAuthenticate()) {
      throw new UserCannotAuthenticateError();
    }


    // --------------------------------------------------
    // 13. Update Google provider usage
    // --------------------------------------------------

    userAuthProvider =
      await this.userAuthProviderService.markUsed(
        userAuthProvider,
      );


    // --------------------------------------------------
    // 14. Update user's last login
    // --------------------------------------------------

    user.markLogin();


    user =
      await this.userService.update(
        user,
      );


    // --------------------------------------------------
    // 15. Create application session
    // --------------------------------------------------

    const { token } =
      await this.sessionService.create({
        userId: user.id,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });


    // --------------------------------------------------
    // 16. Record LOGIN auth event
    // --------------------------------------------------

    await this.authEventService.record({
      userId: user.id,
      type: 'LOGIN',
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });


    // --------------------------------------------------
    // 17. Return authenticated user + session token
    // --------------------------------------------------

    return {
      user,
      token,
    };
  }
}