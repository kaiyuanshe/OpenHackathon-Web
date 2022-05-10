import { requestClient, uploadBlob } from '../pages/api/core';
import { UploadUrl } from '../models/Upload';

export const uploadFile = async (file: File): Promise<string> => {
  const filename = file.name;

  const { uploadUrl, url } = await requestClient<UploadUrl>(
    `user/generateFileUrl`,
    'POST',
    { filename },
  );
  await uploadBlob(uploadUrl, 'PUT', file, {
    'Content-Type': file.type,
  });
  return url;
};
