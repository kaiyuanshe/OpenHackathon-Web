import { action, observable } from 'mobx';
import { FC } from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { i18n } from '../models/Translation';

const { t } = i18n;

export interface DateTimeInputProps {
  id?: string;
  label: string;
  dateName: string;
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

const dateTimeInputStore = new DateTimeInputStore();

export const DateTimeInput: FC<DateTimeInputProps> = ({
  id,
  label,
  dateName,
  required,
  startAt,
  endAt,
  isInvalid,
  onChange,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === `${dateName}StartedAt`) {
      dateTimeInputStore.setStart(value);
    } else {
      dateTimeInputStore.setEnd(value);
    }

    const isInvalid = isInvalidDateTime(
      dateTimeInputStore.start,
      dateTimeInputStore.end,
    );
    onChange(dateName, isInvalid);
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
            name={`${dateName}StartedAt`}
            type="datetime-local"
            required={required}
            defaultValue={startAt && formatDate(startAt, 'YYYY-MM-DDTHH:mm:ss')}
            isInvalid={isInvalid}
            onChange={handleInputChange}
          />
          <Form.Control
            name={`${dateName}EndedAt`}
            type="datetime-local"
            required={required}
            defaultValue={endAt && formatDate(endAt, 'YYYY-MM-DDTHH:mm:ss')}
            isInvalid={isInvalid}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback type="invalid">
            <span>{t('start_time_earlier_end_time')}</span>
          </Form.Control.Feedback>
        </InputGroup>
      </Col>
    </Form.Group>
  );
};
