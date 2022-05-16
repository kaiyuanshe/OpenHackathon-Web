import { UploadUrl } from '../models/Upload';
import { requestClient, uploadBlob } from '../pages/api/core';

export async function uploadFile(file: File) {
  const { type, name } = file;

  const { uploadUrl, url } = await requestClient<UploadUrl>(
    `user/generateFileUrl`,
    'POST',
    { filename: name },
  );
  await uploadBlob(uploadUrl, 'PUT', file, { 'Content-Type': type });

  return url;
}
