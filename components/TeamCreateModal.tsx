import { FC, FormEvent } from 'react';
import { Modal } from 'react-bootstrap';
import { formToJSON } from 'web-utility';
import { NameAvailability } from '../models/Activity';
import { Team } from '../models/Team';
import { requestClient } from '../pages/api/core';
import { TeamEditor } from './TeamEditor';

export interface TeamCreateProps {
  hackathonName: string;
  show: boolean;
  onClose: () => any;
}

export const TeamCreateModal: FC<TeamCreateProps> = ({
  hackathonName,
  show,
  onClose,
}) => {
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams = formToJSON<Team>(event.currentTarget);
    const teamDate = {
      ...inputParams,
      autoApprove: !!inputParams?.autoApprove,
    };

    await requestClient(`hackathon/${hackathonName}/team`, 'PUT', teamDate);

    onClose();
    alert('队伍创建成功！');
  };

  async function isNameAvailable(name = '') {
    // TODO
    // const errorMsg = `队伍名称 ${name} 不可用，请更换名称`;

    // if (!name) {
    //     alert(errorMsg);
    //     return false;
    // }
    // const { nameAvailable } = await requestClient<NameAvailability>(
    //     'hackathon/checkNameAvailability',
    //     'POST',
    //     { name },
    // );
    // if (!nameAvailable) alert(errorMsg);

    // return nameAvailable;
    return true;
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>创建队伍</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TeamEditor onSubmit={submitHandler} checkName={isNameAvailable} />
      </Modal.Body>
    </Modal>
  );
};
