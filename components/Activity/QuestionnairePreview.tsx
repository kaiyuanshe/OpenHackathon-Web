import { observer } from 'mobx-react';
import { Component } from 'react';
import { Container, Form, Row } from 'react-bootstrap';

import { Question } from '../../models/Activity/Question';
import { t } from '../../models/Base/Translation';

export interface QuestionnaireFormProps {
  fields: Question[];
}

@observer
export class QuestionnaireForm extends Component<QuestionnaireFormProps> {
  renderField = ({ options, multiple, title, ...props }: Question) =>
    options ? (
      <Form.Group as="li" className="mb-3" key={title}>
        {title}
        <Row xs={1} sm={3} lg={4} className="mt-2">
          {options.map(value => (
            <Form.Check
              type={multiple ? 'checkbox' : 'radio'}
              label={value}
              name={title}
              value={value}
              id={value}
              key={value}
            />
          ))}
        </Row>
      </Form.Group>
    ) : (
      <Form.Group as="li" className="mb-3 mt-2" key={title} controlId={title}>
        {title}
        <Row>
          <Form.Label />
          <Form.Control name={title} {...props} />
        </Row>
      </Form.Group>
    );

  render() {
    const { fields } = this.props;

    return (
      <Container fluid as="fieldset">
        <legend className="text-center">{t('questionnaire')}</legend>
        <small className="text-muted mt-2">
          {t('please_complete_all_mandatory_fields_before_you_proceed')}
          <a
            className="text-primary ms-2"
            title={t('edit_profile_tips')}
            target="_blank"
            href="https://github.com/settings/profile"
            rel="noreferrer"
          >
            {t('personal_profile')}
          </a>
        </small>
        <ol className="my-3 px-3">{fields.map(this.renderField)}</ol>
      </Container>
    );
  }
}
