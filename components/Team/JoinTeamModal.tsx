import { t } from 'i18next';
import { FormEventHandler } from 'react';
import { Button, Col, Form, Modal, ModalProps } from 'react-bootstrap';

export interface JoinTeamModalProps
  extends Pick<ModalProps, 'show' | 'onHide'> {
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const JoinTeamModal = ({
  show,
  onHide,
  onSubmit,
}: JoinTeamModalProps) => (
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
            placeholder="可输入备注信息，以便团队管理员更快通过审核。"
          />
        </Col>
      </Form.Group>

      <Button className="w-100" variant="primary" type="submit">
        {t('send')}
      </Button>
    </Modal.Body>
  </Modal>
);
