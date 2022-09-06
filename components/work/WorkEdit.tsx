import { FC, FormEvent } from 'react';
import { TeamWork } from '../../models/Team';
import { WorkEditor } from './WorkEditor';
import { Container } from 'react-bootstrap';
import { formToJSON, makeArray } from 'web-utility';
import { requestClient } from '../../pages/api/core';
import { useRouter } from 'next/router';

const WorkEdit: FC<{ work: TeamWork }> = ({ work }) => {
  const router = useRouter();
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams = formToJSON<TeamWork>(event.currentTarget);
    await requestClient(
      `hackathon/${router.query.name}/team/${router.query.tid}/work/${work.id}`,
      'PATCH',
      inputParams,
    );
    alert('修改成功');
  };

  return (
    <Container>
      <h2 className="text-center">编辑作品</h2>
      <WorkEditor onSubmit={submitHandler} work={work} />
    </Container>
  );
};

export default WorkEdit;
