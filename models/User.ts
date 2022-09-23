import { ListModel, Stream } from 'mobx-restful';

import { Base, createListStream } from './Base';
import sessionStore from './Session';

export interface UserBase {
  username: string;
  email: string;
  phone?: string;
}

export type Area = Record<'country' | 'province' | 'city' | 'district', string>;

export type GitHubUser = UserBase &
  Partial<Pick<Area, 'city'>> &
  Record<'nickname' | 'photo' | 'company' | 'profile' | 'accessToken', string>;

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
    AuthingUserBase,
    Partial<Area> {
  address: null;
  birthdate: null;
  blocked: boolean;
  browser: null;
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

export interface User extends AuthingSession {
  arn: null;
}

export class UserModel extends Stream<User>(ListModel) {
  client = sessionStore.client;
  baseURI = 'user';

  openStream() {
    return createListStream<User>(
      `${this.baseURI}/topUsers`,
      this.client,
      count => (this.totalCount = count),
    );
  }
}

export default new UserModel();
