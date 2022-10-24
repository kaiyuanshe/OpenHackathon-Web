import { HTTPError } from 'koajax';
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

export interface ErrorBaseData
  extends Record<'type' | 'title' | 'detail' | 'traceId' | 'instance', string> {
  status: number;
}

export interface ErrorData extends ErrorBaseData {
  errors: Record<string, string[]>;
}

export type Filter<T extends Base = Base> = NewData<T> & {
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

export const integrateError = ({ body }: HTTPError<ErrorData>) => {
  const { title, errors, detail } = body || {};
  const message = errors?.name?.join('');
  return new ReferenceError(
    message ? `${title || ''}\n${message}` : detail || '',
  );
};
