import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import React from 'react';

interface DateTimeInputProps {
  label: string;
  name: string;
  required?: boolean;
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  label,
  name,
  required,
}) => (
  <Form.Group as={Row} className="mb-3" controlId="enrollTime">
    <Form.Label column sm={2}>
      {label}
    </Form.Label>
    <Col column sm={10}>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">时间范围</InputGroup.Text>
        <Form.Control
          name={`${name}StartedAt`}
          type="datetime-local"
          required={required}
        />
        <Form.Control
          name={`${name}EndedAt`}
          type="datetime-local"
          required={required}
        />
      </InputGroup>
    </Col>
  </Form.Group>
);
