import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ChangeEvent, Component } from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { t } from '../models/Base/Translation';

export interface DateTimeInputProps {
  id?: string;
  label: string;
  name: string;
  required?: boolean;
  startAt?: string;
  endAt?: string;
}

@observer
export class DateTimeInput extends Component<DateTimeInputProps> {
  @observable
  accessor start = '';

  @observable
  accessor end = '';

  @computed
  get isInvalid() {
    return +new Date(this.start) > +new Date(this.end);
  }

  handleInputChange = ({
    currentTarget: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (/StartedAt/.test(name)) {
      this.start = value;
    } else {
      this.end = value;
    }
  };

  render() {
    const { id, label, name, required, startAt, endAt } = this.props,
      { isInvalid } = this;

    return (
      <Form.Group as={Row} className="mb-3" controlId={id}>
        <Form.Label column sm={2}>
          {label}
          <span className="text-danger"> *</span>
        </Form.Label>
        <Col sm={10}>
          <InputGroup className="mb-3">
            <InputGroup.Text>{t('time_range')}</InputGroup.Text>
            <Form.Control
              name={`${name}StartedAt`}
              type="datetime-local"
              defaultValue={
                startAt && formatDate(startAt, 'YYYY-MM-DDTHH:mm:ss')
              }
              {...{ required, isInvalid }}
              onChange={this.handleInputChange}
            />
            <Form.Control
              name={`${name}EndedAt`}
              type="datetime-local"
              defaultValue={endAt && formatDate(endAt, 'YYYY-MM-DDTHH:mm:ss')}
              {...{ required, isInvalid }}
              onChange={this.handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              <span>{t('start_time_earlier_end_time')}</span>
            </Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Form.Group>
    );
  }
}
