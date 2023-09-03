import { FC, FormEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { Team } from '../../models/Activity/Team';
import { i18n } from '../../models/Base/Translation';

const { t } = i18n;

export interface TeamEditorProps {
  team?: Team;
  onSubmit: (event: FormEvent<HTMLFormElement>) => any;
}

export const TeamEditor: FC<TeamEditorProps> = ({ team, onSubmit }) => (
  <Form onSubmit={onSubmit}>
    <Form.Group as={Row} className="mb-3" controlId="displayName">
      <Form.Label column sm={3}>
        {t('disaplay_name')}
        <span className="text-danger"> *</span>
      </Form.Label>
      <Col sm={9}>
        <Form.Control
          name="displayName"
          required
          maxLength={128}
          placeholder={t('disaplay_name')}
          defaultValue={team?.displayName}
        />
      </Col>
    </Form.Group>

    {/* todo editor */}
    <Form.Group as={Row} className="mb-3" controlId="description">
      <Form.Label column sm={3}>
        {t('team_introduction')}
        <span className="text-danger"> *</span>
      </Form.Label>
      <Col sm={9}>
        <Form.Control
          name="description"
          as="textarea"
          rows={3}
          maxLength={512}
          placeholder={t('team_introduction')}
          defaultValue={team?.description}
          required
        />
      </Col>
    </Form.Group>

    <Form.Group
      as={Row}
      className="mb-3 align-items-center"
      controlId="autoApprove"
    >
      <Form.Label column sm={3}>
        {t('auto_approve')}
      </Form.Label>
      <Col sm={9}>
        <Form.Check
          inline
          type="radio"
          id="autoApprove-true"
          name="autoApprove"
          label={t('yes')}
          defaultChecked={!!team?.autoApprove}
          value={1}
        />
        <Form.Check
          inline
          type="radio"
          id="autoApprove-false"
          name="autoApprove"
          label={t('no')}
          defaultChecked={!team?.autoApprove}
          value={0}
        />
      </Col>
    </Form.Group>

    <footer className="text-center my-2">
      <Button className="px-5" type="submit" variant="success">
        {t('submit')}
      </Button>
    </footer>
  </Form>
);
