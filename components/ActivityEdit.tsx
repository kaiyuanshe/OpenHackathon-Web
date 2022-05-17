import { FC, FormEvent } from 'react';
import { Activity } from '../models/Activity';
import { ActivityEditor } from './ActivityEditor';
import { Container } from 'react-bootstrap';
import { formToJSON, makeArray } from 'web-utility';
import { ActivityFormData } from './ActivityCreate';
import { requestClient } from '../pages/api/core';

const ActivityEdit: FC<{ activity: Activity }> = ({ activity }) => {
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams = formToJSON<ActivityFormData>(event.currentTarget);

    inputParams.banners = makeArray(inputParams.bannerUrls ?? []).map(
      bannerUrl => {
        const name = bannerUrl.split('/').slice(-1)[0];

        return {
          name,
          description: name,
          uri: bannerUrl,
        };
      },
    );
    inputParams.tags = inputParams?.tagsString?.split(/\s+/) || [];

    await requestClient(`hackathon/${activity.name}`, 'PUT', inputParams);

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
