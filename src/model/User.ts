import { observable } from 'mobx';

import { DataItem, service } from './service';
import { TableModel, loading } from './BaseModel';
import { Activity } from './Activity';

export enum Gender {
    male = 1,
    female = 0,
    other = -1
}

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
    gender: Gender;
    phone: string;
    address: string;
    career_type: string;
}

export interface Registration extends DataItem {
    status: number;
    like: boolean;
    deleted: boolean;
    hackathon_info: Activity;
    assets: any;
    role: number;
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
            service.get<User>(`${this.singleBase}?user_id=${id}`),
            this.getLikeList(id),
            this.getRegistrationList(id)
        ]);
        (body.likes = likes), (body.registrations = registrations);

        return (this.current = body);
    }

    async getRegistratiors(hackathon_name: string) {
        const { body } = await service.get<User[]>('admin/registration/list', {
            hackathon_name: hackathon_name
        });
        return body;
    }
}
