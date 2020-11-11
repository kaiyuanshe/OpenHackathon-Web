import { service, setToken } from './service';
import { User } from './User';

export class SessionModel {
    user?: User;

    async signIn(data: Record<string, any>) {
        await service.post('user/authing', data);

        setToken(data.token);
    }
}
