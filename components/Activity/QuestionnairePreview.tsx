import { observer } from 'mobx-react';
import Link from 'next/link';
import { PureComponent } from 'react';
import { Container, Form, Row } from 'react-bootstrap';

import { Question } from '../../models/Activity/Question';
import { i18n } from '../../models/Base/Translation';

const { t } = i18n;

export interface QuestionnaireFormProps {
  fields: Question[];
}

@observer
export class QuestionnaireForm extends PureComponent<QuestionnaireFormProps> {
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

          <Link href="https://ophapiv2-demo.authing.cn/u" passHref>
            <a className="text-primary ms-2">{t('personal_profile')}</a>
          </Link>
        </small>
        <ol className="my-3 px-3">{fields.map(this.renderField)}</ol>
      </Container>
    );
  }
}
