import { Question } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { BadgeInput } from 'mobx-restful-table';
import { FC, FormEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { t } from '../../models/Base/Translation';

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
      <Form className="container-fluid" onSubmit={handleSubmit}>
        <Row as="ul" className="list-unstyled w-100 align-items-end g-3">
          <Col as="li" sm={4}>
            <Form.Group className="w-20" controlId="id">
              <Form.Label>
                {t('question_id')}
                <span className="text-danger"> *</span>
              </Form.Label>
              <Form.Control name="id" required />
            </Form.Group>
          </Col>
          <Col as="li" sm={8}>
            <Form.Group className="flex-grow-1" controlId="title">
              <Form.Label>
                {t('question_description')}
                <span className="text-danger"> *</span>
              </Form.Label>
              <Form.Control name="title" required />
            </Form.Group>
          </Col>
          <Col as="li" sm={4}>
            <Form.Group controlId="type">
              <Form.Label>{t('question_type')}</Form.Label>
              <Form.Select name="type">
                <option value="text">{t('text')}</option>
                <option value="url">{t('link')}</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col as="li" sm={8}>
            <Form.Group controlId="options">
              <Form.Label>{t('option_config')}</Form.Label>
              <BadgeInput name="options" placeholder={t('tag_placeholder')} />
            </Form.Group>
          </Col>
          <Col as="li" sm={2}>
            <Form.Group controlId="multiple">
              <Form.Label>{t('whether_multiple')}</Form.Label>
              <Form.Check className="mx-2" type="switch" name="multiple" />
            </Form.Group>
          </Col>
          <Col as="li" sm={2}>
            <Form.Group key="required">
              <Form.Label>{t('whether_required')}</Form.Label>
              <Form.Check className="mx-2" type="switch" name="required" />
            </Form.Group>
          </Col>
          <Col sm={8} className="text-end">
            <Button className="px-5 " type="submit" variant="success">
              {t('add_question')}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  },
);

QuestionnaireCreate.displayName = 'QuestionnaireCreate';
