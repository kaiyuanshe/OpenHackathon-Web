import { Base, ListChunk } from '@kaiyuanshe/openhackathon-service';
import { Filter as BaseFilter, IDType, ListModel, RESTClient, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { ownClient } from '../User/Session';

export interface UploadUrl extends Record<'filename' | 'uploadUrl' | 'url', string> {
  expiration: number;
}

export interface ErrorBaseData
  extends Record<'type' | 'title' | 'detail' | 'traceId' | 'instance', string> {
  status: number;
}

export interface ErrorData extends ErrorBaseData {
  errors: Record<string, string[]>;
}

export type InputData<T extends Base = Base> = BaseFilter<T>;

export type Filter<T extends Base = Base> = InputData<T> & {
  top?: number;
};

export interface ListData<T> {
  nextLink: string;
  value: T[];
}

export async function* createListStream<T>(
  path: string,
  client: RESTClient,
  onCount: (total: number) => any,
  method?: 'GET' | 'POST',
) {
  var count = 0;

  while (path) {
    const { body } = await (method === 'POST'
      ? client.post<ListData<T>>(path)
      : client.get<ListData<T>>(path));

    const { nextLink, value } = body!;

    path = nextLink;
    count += value.length;

    onCount(path ? Infinity : count);

    yield* value;
  }
}

export abstract class TableModel<
  D extends Base,
  F extends InputData<D> = InputData<D>,
> extends ListModel<D, F> {
  client = ownClient;

  @toggle('uploading')
  async updateOne(data: BaseFilter<D>, id?: IDType) {
    const { body } = await (id
      ? this.client.put<D>(`${this.baseURI}/${id}`, data)
      : this.client.post<D>(this.baseURI, data));

    return (this.currentOne = body!);
  }

  async loadPage(pageIndex: number, pageSize: number, filter: F) {
    const { body } = await this.client.get<ListChunk<D>>(
      `${this.baseURI}?${buildURLData({ ...filter, pageIndex, pageSize })}`,
    );
    return { pageData: body!.list, totalCount: body!.count };
  }
}
