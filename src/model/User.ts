import { DataItem, service } from './service';

export interface Email {
    verified: boolean;
    email: string;
    primary_email: boolean;
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

export interface User extends DataItem {
    nickname: string;
    emails: Email[];
    avatar_url: string;
    login_times: number;
    last_login_time: number;
    online: boolean;
    provider: string;
    is_super: boolean;
    profile?: UserProfile;
}

export class UserModel {
    activeList: User[] = [];

    async getActiveList() {
        const { body } = await service.get<User[]>('talent/list');

        return (this.activeList = body);
    }
}
