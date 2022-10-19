import { FC, FormEvent } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

import { Message } from '../../models/Message';

export interface MessageEditorProps {
  message?: Message;
  onSubmit: (event: FormEvent<HTMLFormElement>) => any;
}

export const MessageEditor: FC<MessageEditorProps> = ({ message,onSubmit }) => (
  
  <Form onSubmit={onSubmit}>
    <Form.Group as={Row} className="mb-3" controlId="content">
      <Form.Label column sm={2}>
        名称（必填）
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="content"
          required
          maxLength={128}
          placeholder="公告内容"
          defaultValue={message?.content}
        />
      </Col>
    </Form.Group>

    {/* todo editor */}
    <Form.Group as={Row} className="mb-3" controlId="title">
      <Form.Label column sm={2}>
        团队简介
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="title"
          as="textarea"
          rows={3}
          maxLength={512}
          placeholder="团队简介"
          defaultValue={message?.title}
          required
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="title">
      <Form.Label column sm={2}>
        自动同意
      </Form.Label>
      <Col sm={10}>
        <Form.Check
          inline
          type="radio"
          id="autoApprove-true"
          name="title"
          label="是"
          defaultChecked={!!message?.title}
          value={1}
        />
        <Form.Check
          inline
          type="radio"
          id="autoApprove-false"
          name="title"
          label="否"
          defaultChecked={!message?.title}
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
