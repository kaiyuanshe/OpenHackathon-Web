import { Team } from '@kaiyuanshe/openhackathon-service';
import { NewData } from 'mobx-restful';
import { FC, FormEvent } from 'react';
import { Modal } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import activityStore from '../../models/Activity';
import { t } from '../../models/Base/Translation';
import { TeamEditor } from './TeamEditor';

export interface TeamCreateModalProps {
  hackathonName: string;
  show: boolean;
  onClose: () => any;
}

export const TeamCreateModal: FC<TeamCreateModalProps> = ({
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

    alert(t('create_team_success'));
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('create_team')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TeamEditor onSubmit={submitHandler} />
      </Modal.Body>
    </Modal>
  );
};
