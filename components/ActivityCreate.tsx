import { FormEvent, FC } from 'react';
import { Container } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityEditor } from './ActivityEditor';
import activityStore, { Activity } from '../models/Activity';

export interface ActivityFormData extends Activity {
  tagsString?: string;
  bannerUrls: string[] | string;
}

const ActivityCreate: FC = () => {
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const data = formToJSON<ActivityFormData>(event.currentTarget);

    data.banners = [data.bannerUrls ?? []].flat().map(bannerUrl => {
      const name = bannerUrl.split('/').slice(-1)[0];

      return {
        name,
        description: name,
        uri: bannerUrl,
      };
    });
    data.tags = data?.tagsString?.split(/\s+/) || [];
    // @ts-ignore
    await activityStore.updateOne(data);

    if (confirm('活动创建成功，是否申请发布活动?')) {
      await activityStore.publishOne(data.name);

      alert('已申请发布活动,请等待审核');
    }
    location.pathname = `/`;
  };

  return (
    <Container>
      <h2 className="text-center">创建活动</h2>

      <ActivityEditor onSubmit={submitHandler} />
    </Container>
  );
};

export default ActivityCreate;
