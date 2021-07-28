import { observable } from 'mobx';
import { request } from 'koajax';

import { service, setToken } from './service';
import { BaseModel, loading } from './BaseModel';
import { User, UserProfile } from './User';

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

export interface UploadMeta {
    expiration: number;
    filename: string;
    uploadUrl: string;
    url: string;
}

const { localStorage, location } = self;

export class SessionModel extends BaseModel {
    @observable
    user?: Session = localStorage.user && JSON.parse(localStorage.user);

    save(session: User) {
        this.user = { ...this.user, ...session };

        localStorage.user = JSON.stringify(this.user);

        return this.user;
    }

    @loading
    async signIn(data: Record<string, any>) {
        const { body } = await service.post<Session>('login', data);

        setToken(body.token, body.tokenExpiredAt);

        return this.save(body);
    }

    signOut() {
        localStorage.clear();
        location.href = '.';
    }

    async getUser() {
        const { body } = await service.get<User>('user');

        this.save(body);
        return body;
    }

    @loading
    async upload(file: File) {
        const {
            body: { uploadUrl, url }
        } = await service.post<UploadMeta>('user/generateFileUrl', {
            filename: file.name
        });
        await request({
            method: 'PUT',
            path: uploadUrl,
            headers: { 'x-ms-blob-type': 'BlockBlob' },
            body: file
        }).response;

        return url;
    }

    @loading
    async updateProfile({
        avatar,
        ...data
    }: Partial<{ avatar: File } & UserProfile>) {
        if (avatar) {
            const url = await this.upload(avatar);

            await service.put<boolean>('user/picture', { url });
        }
        const { body } = await service.post<User>('user/profile', data);

        return body;
    }
}
