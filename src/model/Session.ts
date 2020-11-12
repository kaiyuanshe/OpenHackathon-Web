import { observable } from 'mobx';

import { service, setToken } from './service';
import { User } from './User';

export interface Session extends User {
    access_token: string;
    authing_id: string;
    blocked: boolean;
    company: string;
    email: string;
    emailVerified: boolean;
    isDeleted: boolean;
    lastIP: string;
    loginsCount: number;
    oauth: string;
    openid: string;
    phone?: string;
    photo: string;
    registerInClient: string;
    registerMethod: string;
    registerSource: string[];
    signedUp: string;
    token: string;
    tokenExpiredAt: string;
    unionid: string;
    userPoolId: string;
    username: string;
    _id: string;
}

const { localStorage, location } = self;

export class SessionModel {
    @observable
    user?: Session = localStorage.user && JSON.parse(localStorage.user);

    async signIn(data: Record<string, any>) {
        const { body } = await service.post<Session>('user/authing', data);

        setToken(data.token);
        localStorage.user = JSON.stringify(body);

        return (this.user = body);
    }

    signOut() {
        localStorage.clear();
        location.href = '.';
    }
}
