import { FormEvent, FC } from 'react';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { makeArray, formToJSON } from 'web-utility';
import { Activity, NameAvailability } from '../models/Activity';
import { requestClient } from '../pages/api/core';
import { ActivityEditor } from './ActivityEditor';

export interface ActivityFormData extends Activity {
  tagsString?: string;
  bannerUrls: string[] | string;
}

const ActivityCreate: FC = () => {
  const router = useRouter();

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams = formToJSON<ActivityFormData>(event.currentTarget);

    const nameAvailable = await isNameAvailable(inputParams.name);

    if (!nameAvailable) return;

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

    await requestClient(`hackathon/${inputParams.name}`, 'PUT', inputParams);

    if (confirm('活动创建成功，是否申请发布活动?')) {
      await requestClient(
        `hackathon/${inputParams.name}/requestPublish`,
        'POST',
      );
      alert('已申请发布活动,请等待审核');
    }
    await router.push(`/activity/${inputParams.name}`);
  };

  async function isNameAvailable(name = '') {
    const errorMsg = `活动名称: ${name} 不可用，请更换名称`;

    if (!name) {
      alert(errorMsg);
      return false;
    }
    const { nameAvailable } = await requestClient<NameAvailability>(
      'hackathon/checkNameAvailability',
      'POST',
      { name },
    );
    if (!nameAvailable) alert(errorMsg);

    return nameAvailable;
  }

  return (
    <Container>
      <h2 className="text-center">创建活动</h2>

      <ActivityEditor
        submitHandler={submitHandler}
        isNameAvailable={isNameAvailable}
      />
    </Container>
  );
};

export default ActivityCreate;
