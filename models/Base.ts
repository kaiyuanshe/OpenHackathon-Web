import { NewData, RESTClient } from 'mobx-restful';

export interface Base {
  id?: string;
  createdAt: string;
  updatedAt: string;
}

export type Media = Record<'name' | 'description' | 'uri', string>;

export interface UploadUrl
  extends Record<'filename' | 'uploadUrl' | 'url', string> {
  expiration: number;
}

export interface ErrorData
  extends Record<'type' | 'title' | 'detail' | 'traceId', string> {
  status: number;
}

export type Filter<T extends Base = Base> = NewData<T> & {
  search?: string;
  orderby?: keyof T;
  top?: number;
};

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
