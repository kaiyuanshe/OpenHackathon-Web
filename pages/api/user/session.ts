import { destroyCookie } from 'nookies';
import { NextApiRequest, NextApiResponse } from 'next';

import { Base, readCookie, writeCookie, request } from '../core';

export interface UserBase {
  username: string;
  email: string;
  phone?: string;
}

export interface GitHubUser extends UserBase {
  nickname: string;
  photo: string;
  city: string;
  company: string;
  profile: string;
  accessToken: string;
}

export interface AuthingUserBase {
  id?: string;
  _id?: string;
  openid: string;
  unionid?: string;
  userId: string;
  userPoolId: string;
}

export interface AuthingToken extends UserBase, AuthingUserBase {
  appId: string;
  clientId: string;
  type: 'user';
}

export interface AuthingIdentity extends Base, AuthingUserBase {
  type: 'generic';
  accessToken: string;
  extIdpId: string;
  isSocial: boolean;
  origianlProfile: null;
  provider: 'github';
  refreshToken: null;
  syncIdentityProviderId: null;
  userIdInIdp: string;
  userInfoInIdp: GitHubUser;
}

export interface AuthingSession
  extends Base,
    UserBase,
    GitHubUser,
    AuthingUserBase {
  address: null;
  birthdate: null;
  blocked: boolean;
  browser: null;
  country: null;
  decryptedToken: AuthingToken;
  device: null;
  emailVerified: boolean;
  encryptedPassword: null;
  externalId: null;
  familyName: null;
  formatted: null;
  gender: 'U';
  givenName: null;
  identities: AuthingIdentity[];
  isDeleted: boolean;
  isRoot: boolean;
  lastIp: string;
  lastLogin: string;
  lastMfaTime: null;
  locale: null;
  locality: null;
  loginsCount: number;
  mainDepartmentCode: null;
  mainDepartmentId: null;
  middleName: null;
  name: null;
  oauth: string;
  passwordSecurityLevel: null;
  phoneCountryCode: null;
  phoneVerified: boolean;
  positions: [];
  postalCode: null;
  preferredUsername: null;
  province: null;
  region: null;
  registerInClient: '6017875f3843d799f455a01c';
  registerMethod: 'social:github';
  registerSource: ['social:github'];
  resetPasswordOnFirstLogin: boolean;
  resetedPassword: boolean;
  secretInfo: null;
  sendSmsCount: number;
  sendSmsLimitCount: number;
  signedUp: string;
  status: 'Activated';
  streetAddress: null;
  syncExtInfo: null;
  thirdPartyIdentity: {
    accessToken: null;
    expiresIn: null;
    provider: null;
    refreshToken: null;
    scope: null;
    updatedAt: null;
  };
  token: string;
  tokenExpiredAt: string;
  website: null;
  zoneinfo: null;
  _message?: string;
}

export interface Session extends AuthingSession {
  arn: null;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      const user = await request<Session>(
        `user/${readCookie(req, 'userId')}`,
        'GET',
        undefined,
        { req, res },
      );
      return res.json(user);
    }
    case 'POST': {
      const user = await request<Session>('login', 'POST', req.body, {
        req,
        res,
      });
      writeCookie(res, 'token', user.token, user.tokenExpiredAt);
      writeCookie(res, 'userId', user.id!, user.tokenExpiredAt);

      return res.json(user);
    }
    case 'DELETE': {
      destroyCookie({ res }, 'token', { path: '/' });
      destroyCookie({ res }, 'userId', { path: '/' });

      return res.json({});
    }
  }
};
