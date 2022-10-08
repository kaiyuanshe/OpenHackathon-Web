import { ListModel, NewData, Stream, toggle } from 'mobx-restful';
import sessionStore from './Session';
import { Base, createListStream } from './Base';
import { computed } from 'mobx';
import { groupBy } from 'web-utility';

// Type of organizer. host:主办, organizer:承办，coorganzer:协办, sponsor:赞助, titleSponsor:冠名
export const OrganizationTypeName = {
  host: '主办',
  organizer: '承办',
  coorganizer: '协办',
  sponsor: '赞助',
  titleSponsor: '冠名',
};

interface OrganizationLogo {
  name?: string;
  description?: string;
  uri: string;
}

export interface Organization extends Base {
  id: string;
  name: string;
  description?: string;
  type: 'host' | 'organizer' | 'coorganizer' | 'sponsor' | 'titleSponsor';
  logo?: OrganizationLogo;
}

export class OrganizationModel extends Stream<Organization>(ListModel) {
  client = sessionStore.client;
  indexKey = 'id' as const;

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
  async updateOne({ ...data }: NewData<Organization>) {
    const { body } = await this.client.put<Organization>(this.baseURI, data);
    return body!;
  }
}
