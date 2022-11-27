import { ListModel, Stream } from 'mobx-restful';

import { Base, createListStream, Filter } from './Base';
import sessionStore from './Session';
import { AuthingSession } from './User';

export interface PlatformAdmin extends Base {
  hackathonName: string;
  description: string;
  userId: string;
  user?: AuthingSession;
}

export interface PlatformAdminFilter extends Filter<PlatformAdmin> {}

export class PlatformAdminModel extends Stream<
  PlatformAdmin,
  PlatformAdminFilter
>(ListModel) {
  client = sessionStore.client;
  baseURI = 'platform/admin';

  openStream() {
    return createListStream<PlatformAdmin>(
      `${this.baseURI}s`,
      this.client,
      count => (this.totalCount = count),
    );
  }
}

export default new PlatformAdminModel();
