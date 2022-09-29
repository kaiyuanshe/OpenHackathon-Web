import { FormEvent, FC } from 'react';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { makeArray, formToJSON } from 'web-utility';
import { TeamWork } from '../../models/Team';
import { requestClient } from '../../pages/api/core';
import { WorkEditor } from './WorkEditor';

const WorkCreate: FC = () => {
  const router = useRouter();
  const { name, tid } = router.query || {};

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const inputParams = formToJSON<TeamWork>(event.currentTarget);
    await requestClient(
      `hackathon/${name}/team/${tid}/work`,
      'PUT',
      inputParams,
    );
    await router.push(
      `/activity/${router.query.name}/team/${router.query.tid}`,
    );
  };

  return (
    <Container>
      <h2 className="text-center">创建作品</h2>
      <WorkEditor onSubmit={submitHandler} />
    </Container>
  );
};

export default WorkCreate;
