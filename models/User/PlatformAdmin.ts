import { PlatformAdmin } from '@kaiyuanshe/openhackathon-service';
import { observable } from 'mobx';
import { IDType, toggle } from 'mobx-restful';

import { Filter, TableModel } from '../Base';

export type PlatformAdminFilter = Filter<PlatformAdmin>;

export class PlatformAdminModel extends TableModel<
  PlatformAdmin,
  PlatformAdminFilter
> {
  baseURI = 'platform/admin';

  @observable
  accessor isPlatformAdmin = false;

  async checkAuthorization() {
    try {
      await this.getList();
      return (this.isPlatformAdmin = true);
    } catch (error: any) {
      return (this.isPlatformAdmin = false);
    }
  }

  @toggle('uploading')
  async addOnePlatformAdmin(id: IDType) {
    const { body } = await this.client.put<PlatformAdmin>(
      `${this.baseURI}/${id}`,
    );
    return (this.currentOne = body!);
  }

  @toggle('uploading')
  async deleteOne(userId: IDType) {
    await this.client.delete(`${this.baseURI}/${userId}`);
    await this.removeOne(userId);
  }
}

export default new PlatformAdminModel();
