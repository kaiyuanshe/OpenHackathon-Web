import { groupBy } from 'web-utility';
import { computed } from 'mobx';
import { ListModel, NewData, Stream, toggle } from 'mobx-restful';

import { Base, Media, createListStream } from './Base';
import sessionStore from './Session';

export enum OrganizationType {
  Host = 'host',
  Organizer = 'organizer',
  Coorganizer = 'coorganizer',
  Sponsor = 'sponsor',
  TitleSponsor = 'titleSponsor',
}

export const OrganizationTypeName = {
  [OrganizationType.Host]: '主办',
  [OrganizationType.Organizer]: '承办',
  [OrganizationType.Coorganizer]: '协办',
  [OrganizationType.Sponsor]: '赞助',
  [OrganizationType.TitleSponsor]: '冠名',
};

export interface Organization extends Base {
  name: string;
  description?: string;
  type: OrganizationType;
  logo?: Media;
}

export class OrganizationModel extends Stream<Organization>(ListModel) {
  client = sessionStore.client;

  constructor(public baseURI: string) {
    super();
    this.baseURI = `${this.baseURI}/organizer`;
  }

  openStream() {
    return createListStream<Organization>(
      `${this.baseURI}s`,
      this.client,
      count => (this.totalCount = count),
    );
  }

  @computed
  get typeCount() {
    return Object.fromEntries(
      Object.entries(groupBy(this.allItems, 'type')).map(
        ([type, { length }]) => [type, length],
      ),
    ) as Record<Organization['type'], number>;
  }

  @toggle('uploading')
  async updateOne(data: NewData<Organization>, id?: IDType) {
    const { body } = await (id
      ? this.client.patch<Organization>(`${this.baseURI}/${id}`, data)
      : this.client.put<Organization>(this.baseURI, data));
    return body!;
  }
}
