import { FormEvent, FC } from 'react';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { makeArray, formToJSON } from 'web-utility';
import { TeamWork } from '../../models/Team';
import { requestClient } from '../../pages/api/core';
import { WorkEditor } from './WorkEditor';

const WorkCreate: FC = () => {
  const router = useRouter();

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams = formToJSON<TeamWork>(event.currentTarget);

    await requestClient(`hackathon/${inputParams.title}`, 'PUT', inputParams);

    // if (confirm('活动创建成功，是否申请发布活动?')) {
    //   await requestClient(
    //     `hackathon/${inputParams.name}/requestPublish`,
    //     'POST',
    //   );
    //   alert('已申请发布活动,请等待审核');
    // }
    // await router.push(`/activity/${inputParams.name}`);
  };

  return (
    <Container>
      <h2 className="text-center">创建作品</h2>
      <WorkEditor onSubmit={submitHandler} />
    </Container>
  );
};

export default WorkCreate;
