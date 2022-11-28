import { observable } from 'mobx';
import { ListModel, Stream } from 'mobx-restful';

import { Base, createListStream, Filter } from './Base';
import sessionStore from './Session';
import { AuthingSession } from './User';

export interface PlatformAdmin
  extends Base,
    Record<'hackathonName' | 'description' | 'userId', string> {
  user?: AuthingSession;
}

export type PlatformAdminFilter = Filter<PlatformAdmin>;

export class PlatformAdminModel extends Stream<
  PlatformAdmin,
  PlatformAdminFilter
>(ListModel) {
  client = sessionStore.client;
  baseURI = 'platform/admin';

  @observable
  isPlatformAdmin = false;

  async getIsPlatformAdmin() {
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
}

export default new PlatformAdminModel();
