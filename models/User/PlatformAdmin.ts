import { makeObservable, observable } from 'mobx';
import { IDType, ListModel, Stream, toggle } from 'mobx-restful';

import { HackathonAdmin } from '../Activity/Staff';
import { createListStream, Filter } from '../Base';
import sessionStore from './Session';

export type PlatformAdmin = HackathonAdmin;

export type PlatformAdminFilter = Filter<PlatformAdmin>;

export class PlatformAdminModel extends Stream<
  PlatformAdmin,
  PlatformAdminFilter
>(ListModel) {
  constructor() {
    super();
    makeObservable(this);
  }

  client = sessionStore.client;
  baseURI = 'platform/admin';
  indexKey = 'userId' as const;

  @observable
  isPlatformAdmin = false;

  async checkAuthorization() {
    try {
      await this.getList();
      return (this.isPlatformAdmin = true);
    } catch (error: any) {
      return (this.isPlatformAdmin = false);
    }
  }

  openStream() {
    return createListStream<PlatformAdmin>(
      `${this.baseURI}s`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @toggle('uploading')
  async addOnePlatformAdmin(id: IDType) {
    const { body } = await this.client.put<PlatformAdmin>(
      `${this.baseURI}/${id}`,
    );
    return (this.currentOne = body!);
  }

  @toggle('uploading')
  async deleteOne(userId: string) {
    await this.client.delete(`${this.baseURI}/${userId}`);
    await this.removeOne(userId);
  }
}

export default new PlatformAdminModel();
