import { HTTPError, Request, request } from 'koajax';
import { DataObject, toggle } from 'mobx-restful';
import { FileModel } from 'mobx-restful-table';

import sessionStore from '../User/Session';
import { ErrorBaseData, UploadUrl } from './index';

export class AzureFileModel extends FileModel {
  static async uploadBlob<T = void>(
    fullPath: string,
    method: Request['method'] = 'PUT',
    body?: any,
    headers: DataObject = {},
  ) {
    headers['x-ms-blob-type'] = 'BlockBlob';

    const { response } = request<T>({
      path: fullPath,
      method,
      body,
      headers,
    });
    const { headers: header, body: data } = await response;

    if (!data || !('traceId' in (data as DataObject))) return data!;

    const { status, title, detail } = data as unknown as ErrorBaseData;

    throw new HTTPError(detail || title, {
      status,
      statusText: title,
      headers: header,
      body: data,
    });
  }

  @toggle('uploading')
  async upload(file: File) {
    const { type, name } = file;

    const { body } = await sessionStore.client.post<UploadUrl>(
      `user/generateFileUrl`,
      {
        filename: name,
      },
    );
    const parts = body!.uploadUrl.split('/');

    const path = parts.slice(0, -1).join('/'),
      [fileName, data] = parts.at(-1)!.split('?');

    const URI_Put = `${path}/${encodeURIComponent(fileName)}?${data}`;

    await AzureFileModel.uploadBlob(URI_Put, 'PUT', file, {
      'Content-Type': type,
    });

    const { origin, pathname } = new URL(body!.url);

    const URI_Get = `${
      origin + pathname.split('/').slice(0, -1).join('/')
    }/${encodeURIComponent(fileName)}`;

    return super.upload(URI_Get);
  }
}

export default new AzureFileModel();
