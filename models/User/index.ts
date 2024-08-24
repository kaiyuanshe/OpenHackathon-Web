import { User, UserRankListChunk } from '@kaiyuanshe/openhackathon-service';

import { Filter, TableModel } from '../Base';

export interface AuthingUserBase {
  _id?: string;
  openid: string;
  unionid?: string;
  userId: string;
  userPoolId: string;
}

export interface UserFilter extends Filter<User> {
  keywords?: string;
}

export class UserModel extends TableModel<User, UserFilter> {
  baseURI = 'user';

  async getUserTopList() {
    const { body } = await this.client.get<UserRankListChunk>(
      `activity-log/user-rank`,
    );
    return body!.list;
  }
}

export default new UserModel();
