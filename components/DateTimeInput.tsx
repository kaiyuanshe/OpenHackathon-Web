import { FC } from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';

export interface DateTimeInputProps {
  id?: string;
  label: string;
  name: string;
  required?: boolean;
}

export const DateTimeInput: FC<DateTimeInputProps> = ({
  id,
  label,
  name,
  required,
}) => (
  <Form.Group as={Row} className="mb-3" controlId={id}>
    <Form.Label column sm={2}>
      {label}
    </Form.Label>
    <Col column sm={10}>
      <InputGroup className="mb-3">
        <InputGroup.Text>时间范围</InputGroup.Text>
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
