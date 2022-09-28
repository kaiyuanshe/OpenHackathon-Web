import { formToJSON } from 'web-utility';
import { NewData } from 'mobx-restful';
import { FC, FormEvent } from 'react';
import { Modal } from 'react-bootstrap';

import { TeamEditor } from './TeamEditor';
import activityStore from '../models/Activity';
import { Team } from '../models/Team';

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

    const { autoApprove, ...data } = formToJSON<NewData<Team>>(
      event.currentTarget,
    );
    await activityStore
      .teamOf(hackathonName)
      .updateOne({ ...data, autoApprove: !!autoApprove });

    onClose();
    alert('队伍创建成功！');
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>创建队伍</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TeamEditor onSubmit={submitHandler} />
      </Modal.Body>
    </Modal>
  );
};
