import { FC, FormEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { Team } from '../models/Team';

export interface TeamEditorProps {
  team?: Team;
  onSubmit: (event: FormEvent<HTMLFormElement>) => any;
}

export const TeamEditor: FC<TeamEditorProps> = ({ team, onSubmit }) => (
  <Form onSubmit={onSubmit}>
    <Form.Group as={Row} className="mb-3" controlId="displayName">
      <Form.Label column sm={2}>
        名称（必填）
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="displayName"
          required
          maxLength={128}
          placeholder="显示名称"
          defaultValue={team?.displayName}
        />
      </Col>
    </Form.Group>

    {/* todo editor */}
    <Form.Group as={Row} className="mb-3" controlId="description">
      <Form.Label column sm={2}>
        团队简介
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="description"
          as="textarea"
          rows={3}
          maxLength={512}
          placeholder="团队简介"
          defaultValue={team?.description}
          required
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="autoApprove">
      <Form.Label column sm={2}>
        自动同意
      </Form.Label>
      <Col sm={10}>
        <Form.Check
          inline
          type="radio"
          id="autoApprove-true"
          name="autoApprove"
          label="是"
          defaultChecked={!!team?.autoApprove}
          value={1}
        />
        <Form.Check
          inline
          type="radio"
          id="autoApprove-false"
          name="autoApprove"
          label="否"
          defaultChecked={!team?.autoApprove}
          value={0}
        />
      </Col>
    </Form.Group>

    <Row>
      <Button variant="primary" type="submit" className="center">
        提交
      </Button>
    </Row>
  </Form>
);
