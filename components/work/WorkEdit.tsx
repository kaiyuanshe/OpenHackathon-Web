import { FC, FormEvent } from 'react';
import { TeamWork } from '../../models/Team';
import { WorkEditor } from './WorkEditor';
import { Container } from 'react-bootstrap';
import { formToJSON, makeArray } from 'web-utility';
import { requestClient } from '../../pages/api/core';

const workEdit: FC<{ work: TeamWork }> = ({ work }) => {
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams = formToJSON<TeamWork>(event.currentTarget);
    await requestClient(`hackathon/${work.id}`, 'PUT', inputParams);

    alert('修改成功');
  };

  return (
    <Container>
      <h2 className="text-center">团队作品</h2>
      <WorkEditor onSubmit={submitHandler} work={work} />
    </Container>
  );
};

export default workEdit;
