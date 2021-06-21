import { observable } from 'mobx';

import { DataItem, ListBox, service } from './service';
import { TableModel, loading } from './BaseModel';
import { Registration } from './Registration';

export enum Gender {
    male = 'M',
    female = 'F',
    other = 'U'
}

export interface Contact {
    email: string;
    emailVerified: boolean;
    phone?: string;
    phoneVerified: boolean;
    website?: string;
}

export enum Provider {
    github = 'github',
    qq = 'qq',
    wechat = 'weixin',
    weibo = 'weibo'
}

export interface Identity {
    openid: string;
    userId: string;
    userIdInIdp: string;
    connectionId: string;
    isSocial: boolean;
    provider: Provider;
    userPoolId: string;
}

export interface Group extends Omit<DataItem, 'id' | 'creatorId'> {
    code: string;
    description: string;
    users: ListBox<User>;
}

export interface Role extends Omit<DataItem, 'id' | 'name' | 'creatorId'> {
    code: string;
    arn: string;
    description: string;
    isSystem: boolean;
    users: ListBox<User>;
    parent: Role;
}

export interface UserName {
    familyName: string;
    givenName: string;
    middleName: string;
}

export interface Address {
    country: string;
    province: string;
    city: string;
    region: string;
    address: string;
    streetAddress: string;
    locality: string;
    postalCode: string;
}

export interface UserProfile
    extends Partial<UserName>,
        Partial<Address>,
        Contact {
    username: string;
    preferredUsername?: string;
    nickname: string;
    photo: string;
    profile: string;
    formatted?: string;
    birthdate?: string;
    gender: Gender;
    company?: string;
}

export interface UserMeta {
    userPoolId: string;
    openId: string;
    unionid: string;
    token: string;
    tokenExpiredAt: string;
    registerSource: string[];
    identities: Identity[];
    groups?: ListBox<Group>;
    roles?: ListBox<Role>;
    arn?: string;
    blocked: boolean;
    isDeleted: boolean;
    loginsCount: number;
    locale?: string;
    zoneinfo?: string;
    signedUp: string;
    browser?: string;
    device?: string;
    oAuth: string;
}

export interface User extends DataItem, UserProfile, UserMeta {
    likes?: Registration[];
    registrations?: Registration[];
}

export class UserModel extends TableModel<User> {
    singleBase = 'user';
    multipleBase = 'admin/user/list';

    @observable
    activeList: User[] = [];

    @loading
    async getActiveList() {
        const { body } = await service.get<User[]>('talent/list');

        return (this.activeList = body);
    }

    async getLikeList(uid: string) {
        const { body } = await service.get<Registration[]>(
            'user/hackathon/like?user_id=' + uid
        );
        return body;
    }

    async getRegistrationList(uid: string) {
        const { body } = await service.get<Registration[]>(
            'user/registration/list?user_id=' + uid
        );
        return body;
    }

    @loading
    async getOne(id: string) {
        const [{ body }, likes, registrations] = await Promise.all([
            service.get<User>(`${this.singleBase}/${id}`)
            // this.getLikeList(id),
            // this.getRegistrationList(id)
        ]);
        // (body.likes = likes), (body.registrations = registrations);

        return (this.current = body);
    }
}
