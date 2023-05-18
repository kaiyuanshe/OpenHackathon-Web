import { action, observable } from 'mobx';
import { FC } from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { i18n } from '../models/Translation';

const { t } = i18n;

export interface DateTimeInputProps {
  id?: string;
  label: string;
  name: string;
  required?: boolean;
  startAt?: string;
  endAt?: string;
  isInvalid?: boolean;
  onChange: (name: string, isInvalid: boolean) => void;
}

class DateTimeInputStore {
  @observable start = '';
  @observable end = '';

  @action setStart(value: string) {
    this.start = value;
  }

  @action setEnd(value: string) {
    this.end = value;
  }
}

export const DateTimeInput: FC<DateTimeInputProps> = ({
  id,
  label,
  name,
  required,
  startAt,
  endAt,
  isInvalid,
  onChange,
}) => {
  const dateTimeInputStore = new DateTimeInputStore();

  console.log(dateTimeInputStore.start, dateTimeInputStore.end);

  const handleStartAtInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    console.log(value);
    dateTimeInputStore.setStart(value);
    const isInvalid = isInvalidDateTime(
      dateTimeInputStore.start,
      dateTimeInputStore.end,
    );

    onChange(name, isInvalid);
  };

  const handleEndAtInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;

    dateTimeInputStore.setEnd(value);
    const isInvalid = isInvalidDateTime(
      dateTimeInputStore.start,
      dateTimeInputStore.end,
    );
    onChange(name, isInvalid);
  };

  const isInvalidDateTime = (startAt: string, endAt: string) => {
    if (startAt && endAt) {
      const startDate = new Date(startAt);
      const endDate = new Date(endAt);
      return startDate > endDate;
    }
    return false;
  };

  return (
    <Form.Group as={Row} className="mb-3" controlId={id}>
      <Form.Label column sm={2}>
        {label}
      </Form.Label>
      <Col sm={10}>
        <InputGroup className="mb-3">
          <InputGroup.Text>{t('time_range')}</InputGroup.Text>
          <Form.Control
            name={`${name}StartedAt`}
            type="datetime-local"
            required={required}
            defaultValue={startAt && formatDate(startAt, 'YYYY-MM-DDTHH:mm:ss')}
            isInvalid={isInvalid}
            onChange={handleStartAtInputChange}
          />
          <Form.Control
            name={`${name}EndedAt`}
            type="datetime-local"
            required={required}
            defaultValue={endAt && formatDate(endAt, 'YYYY-MM-DDTHH:mm:ss')}
            isInvalid={isInvalid}
            onChange={handleEndAtInputChange}
          />
          <Form.Control.Feedback type="invalid">
            开始时间必须小于结束时间
          </Form.Control.Feedback>
        </InputGroup>
      </Col>
    </Form.Group>
  );
};
