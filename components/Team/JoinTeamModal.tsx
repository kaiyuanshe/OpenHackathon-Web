import { FC, FormEventHandler } from 'react';
import { Button, Col, Form, Modal, ModalProps } from 'react-bootstrap';

import { i18n } from '../../models/Base/Translation';

const { t } = i18n;

export interface JoinTeamModalProps
  extends Pick<ModalProps, 'show' | 'onHide'> {
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const JoinTeamModal: FC<JoinTeamModalProps> = ({
  show,
  onHide,
  onSubmit,
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>{t('join_team')}</Modal.Title>
    </Modal.Header>
    <Modal.Body as="form" onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="description">
        <Form.Label column sm={12}>
          {t('remark')}
        </Form.Label>
        <Col sm={12}>
          <Form.Control
            as="textarea"
            name="description"
            maxLength={512}
            rows={3}
            placeholder={t('remark_placeholder')}
          />
        </Col>
      </Form.Group>

      <Button className="w-100" variant="primary" type="submit">
        {t('send')}
      </Button>
    </Modal.Body>
  </Modal>
);
