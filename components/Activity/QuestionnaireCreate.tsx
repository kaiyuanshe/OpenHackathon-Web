import { observer } from 'mobx-react';
import { BadgeInput } from 'mobx-restful-table';
import { FC, FormEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { Question } from '../../models/Question';
import { i18n } from '../../models/Translation';

const { t } = i18n;

interface QuestionnaireCreateForm extends Omit<Question, 'options'> {
  options?: string | string[];
}

export interface QuestionnaireCreateProps {
  onAdd: (data: Question) => any;
}

export const QuestionnaireCreate: FC<QuestionnaireCreateProps> = observer(
  ({ onAdd }) => {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { options, ...data } = formToJSON(
        event.currentTarget,
      ) as QuestionnaireCreateForm;

      const emitData: Question = {
        ...data,
        options: options
          ? typeof options === 'string'
            ? [options]
            : options
          : undefined,
      };

      onAdd(emitData);
    };

    return (
      <div className="container-fluid">
        <Form onSubmit={handleSubmit}>
          <Row as="ul" className="list-unstyled w-100 align-items-end">
            <Col as="li" sm={4}>
              <Form.Group className="mb-2 w-20" controlId="id">
                <Form.Label>
                  {t('question_id')}
                  {t('quote_required')}
                </Form.Label>
                <Form.Control name={'id'} required />
              </Form.Group>
            </Col>
            <Col as="li" sm={8}>
              <Form.Group className="mb-2 flex-grow-1" controlId="title">
                <Form.Label>
                  {t('question_description')}
                  {t('quote_required')}
                </Form.Label>
                <Form.Control name={'title'} required />
              </Form.Group>
            </Col>
            <Col as="li" sm={4}>
              <Form.Group className="mb-2" controlId="type">
                <Form.Label>{t('question_type')}</Form.Label>
                <Form.Select name="type">
                  <option value="text">{t('text')}</option>
                  <option value="url">{t('link')}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col as="li" sm={8}>
              <Form.Group className="mb-2" controlId="options">
                <Form.Label>{t('option_config')}</Form.Label>
                <BadgeInput name="options" placeholder={t('tag_placeholder')} />
              </Form.Group>
            </Col>
            <Col as="li" sm={2}>
              <Form.Group className="mb-2" controlId="multiple">
                <Form.Label>{t('whether_multiple')}</Form.Label>
                <Form.Check className="mx-2" type="switch" name="multiple" />
              </Form.Group>
            </Col>
            <Col as="li" sm={2}>
              <Form.Group className="mb-2" key="required">
                <Form.Label>{t('whether_required')}</Form.Label>
                <Form.Check className="mx-2" type="switch" name="required" />
              </Form.Group>
            </Col>
            <Col sm={8} className="text-end">
              <Button className="px-5 mb-2" type="submit" variant="success">
                {t('add_question')}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  },
);

QuestionnaireCreate.displayName = 'QuestionnaireCreate';
