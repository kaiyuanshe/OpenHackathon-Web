import { observable } from 'mobx';

import { DataItem, service } from './service';
import { Activity } from './Activity';

export interface Email {
    verified: boolean;
    email: string;
    primary_email: boolean;
}

export enum Provider {
    github = 'github',
    qq = 'qq',
    wechat = 'weixin',
    weibo = 'weibo'
}

export interface UserProfile {
    user_id: string;
    real_name: string;
    age: number;
    gender: number;
    phone: string;
    address: string;
    career_type: string;
}

export interface Registration extends DataItem {
    status: 3;
    like: true;
    deleted: false;
    hackathon_info: Activity;
    assets: any;
    role: 3;
    user: string;
    hackathon: string;
    remark: string;
}

export interface User extends DataItem {
    nickname: string;
    emails: Email[];
    avatar_url: string;
    login_times: number;
    last_login_time: number;
    online: boolean;
    provider: keyof typeof Provider;
    is_super: boolean;
    profile?: UserProfile;
    likes?: Registration[];
    registrations?: Registration[];
}

export class UserModel {
    @observable
    activeList: User[] = [];

    @observable
    current: User = {} as User;

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

    async getOne(id: string) {
        const [{ body }, likes, registrations] = await Promise.all([
            service.get<User>('user?user_id=' + id),
            this.getLikeList(id),
            this.getRegistrationList(id)
        ]);
        (body.likes = likes), (body.registrations = registrations);

        return (this.current = body);
    }
}
