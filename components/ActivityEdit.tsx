import { formToJSON } from 'web-utility';
import { FC, FormEvent } from 'react';
import { Container } from 'react-bootstrap';

import activityStore, { Activity } from '../models/Activity';
import { ActivityEditor } from './ActivityEditor';
import { ActivityFormData } from './ActivityCreate';

const ActivityEdit: FC<{ activity: Activity }> = ({ activity }) => {
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams = formToJSON<ActivityFormData>(event.currentTarget);

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
    await activityStore.updateOne(inputParams, activity.name);

    alert('修改成功');
  };

  return (
    <Container>
      <h2 className="text-center">创建活动</h2>

      <ActivityEditor onSubmit={submitHandler} activity={activity} />
    </Container>
  );
};

export default ActivityEdit;
