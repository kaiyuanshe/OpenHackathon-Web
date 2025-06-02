import { SignedLink } from '@kaiyuanshe/openhackathon-service';
import { toggle } from 'mobx-restful';
import { FileModel } from 'mobx-restful-table';
import { blobOf, uniqueID } from 'web-utility';

import sessionStore from '../User/Session';

export class S3FileModel extends FileModel {
  client = sessionStore.client;

  @toggle('uploading')
  async upload(file: string | Blob) {
    if (typeof file === 'string') {
      const name = file.split('/').pop()!;

      file = new File([await blobOf(file)], name);
    }
    const { body } = await this.client.post<SignedLink>(
      `file/signed-link/${file instanceof File ? file.name : uniqueID()}`,
    );
    await this.client.put(body!.putLink, file, { 'Content-Type': file.type });

    return super.upload(body!.getLink);
  }

  @toggle('uploading')
  async delete(link: string) {
    await this.client.delete(`file/${link.replace(`${this.client.baseURI}/file/`, '')}`);

    await super.delete(link);
  }
}

export default new S3FileModel();
