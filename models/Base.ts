import { RESTClient } from 'mobx-restful';

export interface Base {
  id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  name: string;
  description: string;
  uri: string;
}

export interface ErrorData {
  type: string;
  title: string;
  status: number;
  detail: string;
  traceId: string;
}

export interface BaseFilter<T extends Base = Base> {
  orderby?: keyof T;
  top?: number;
}

export interface ListData<T> {
  nextLink: string;
  value: T[];
}

export const isServer = () => typeof window === 'undefined';

export async function* createListStream<T>(
  path: string,
  client: RESTClient,
  onCount: (total: number) => any,
) {
  var count = 0;

  while (path) {
    const { body } = await client.get<ListData<T>>(path);

    const { nextLink, value } = body!;

    path = nextLink;
    count += value.length;

    onCount(path ? Infinity : count);

    yield* value;
  }
}
