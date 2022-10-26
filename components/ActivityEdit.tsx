import { t } from 'i18next';
import { FC, FormEvent } from 'react';
import { Container } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import activityStore, { Activity } from '../models/Activity';
import { ActivityFormData } from './ActivityCreate';
import { ActivityEditor } from './ActivityEditor';

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
      <h2 className="text-center">{t('create_activity')}</h2>

      <ActivityEditor onSubmit={submitHandler} activity={activity} />
    </Container>
  );
};

export default ActivityEdit;
