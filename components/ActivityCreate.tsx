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

    const { name, ...inputParams } = formToJSON<ActivityFormData>(
      event.currentTarget,
    );
    inputParams.banners = [inputParams.bannerUrls ?? []]
      .flat()
      .map(bannerUrl => {
        const name = bannerUrl.split('/').slice(-1)[0];

        return {
          name,
          description: name,
          uri: bannerUrl,
        };
      });
    inputParams.tags = inputParams?.tagsString?.split(/\s+/) || [];
    // @ts-ignore
    await activityStore.updateOne(inputParams);

    if (confirm('活动创建成功，是否申请发布活动?')) {
      await activityStore.publishOne(name);

      alert('已申请发布活动,请等待审核');
    }
    location.pathname = `/activity/${name}`;
  };

  return (
    <Container>
      <h2 className="text-center">创建活动</h2>

      <ActivityEditor onSubmit={submitHandler} />
    </Container>
  );
};

export default ActivityCreate;
