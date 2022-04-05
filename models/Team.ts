import { Base } from "../pages/api/core";

export interface Team extends Base {
  hackathonName: string;
  id: string;
  displayName: string;
  description: string;
  autoApprove: boolean;
  creatorId: string;
  creator: Creator;
  membersCount: number;
}

export interface Identity {
  openid: string;
  userIdInIdp: string;
  userId: string;
  connectionId: string;
  isSocial: boolean;
  provider: string;
  userPoolId: string;
  refreshToken: string;
  accessToken: string;
}

export interface Creator {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  givenName: string;
  familyName: string;
  middleName: string;
  profile: string;
  preferredUsername: string;
  website: string;
  gender: string;
  birthdate: string;
  zoneinfo: string;
  company: string;
  locale: string;
  formatted: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  address: string;
  browser: string;
  device: string;
  isDeleted: boolean;
  id: string;
  arn: string;
  userPoolId: string;
  username: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  unionid: string;
  openId: string;
  identities: Identity[];
  nickname: string;
  registerSource: string[];
  photo: string;
  password: string;
  oAuth: string;
  token: string;
  tokenExpiredAt: Date;
  loginsCount: number;
  lastLogin: Date;
  lastIp: string;
  signedUp: Date;
  blocked: boolean;
}
