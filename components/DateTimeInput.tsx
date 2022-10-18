import { FC } from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { formatDate } from 'web-utility';

export interface DateTimeInputProps {
  id?: string;
  label: string;
  name: string;
  required?: boolean;
  startAt?: string;
  endAt?: string;
}

export const DateTimeInput: FC<DateTimeInputProps> = ({
  id,
  label,
  name,
  required,
  startAt,
  endAt,
}) => (
  <Form.Group as={Row} className="mb-3" controlId={id}>
    <Form.Label column sm={2}>
      {label}
    </Form.Label>
    <Col sm={10}>
      <InputGroup className="mb-3">
        <InputGroup.Text>时间范围</InputGroup.Text>
        <Form.Control
          name={`${name}StartedAt`}
          type="datetime-local"
          required={required}
          defaultValue={startAt && formatDate(startAt, 'YYYY-MM-DDTHH:mm:ss')}
        />
        <Form.Control
          name={`${name}EndedAt`}
          type="datetime-local"
          required={required}
          defaultValue={endAt && formatDate(endAt, 'YYYY-MM-DDTHH:mm:ss')}
        />
      </InputGroup>
    </Col>
  </Form.Group>
);
