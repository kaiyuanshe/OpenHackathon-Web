import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import React from 'react';

export const DateTimeInput: React.FC<{
  label: string;
  inputName: string;
}> = props => (
  <Form.Group as={Row} className="mb-3" controlId="enrollTime">
    <Form.Label column sm={2}>
      {props.label}
    </Form.Label>
    <Col column sm={10}>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">时间范围</InputGroup.Text>
        <Form.Control
          name={`${props.inputName}StartedAt`}
          type="datetime-local"
        />
        <Form.Control
          name={`${props.inputName}EndedAt`}
          type="datetime-local"
        />
      </InputGroup>
    </Col>
  </Form.Group>
);
