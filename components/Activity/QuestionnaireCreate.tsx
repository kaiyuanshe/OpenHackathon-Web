import { BadgeInput } from 'mobx-restful-table';
import { FormEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { Question } from '../../models/Question';
import { i18n } from '../../models/Translation';

const { t } = i18n;

interface QuestionnaireCreateForm extends Omit<Question, 'options'> {
  options?: string | string[];
}

export interface QuestionnaireCreateProps {
  onAdd: (data: Question) => void;
}

export function QuestionnaireCreate({ onAdd }: QuestionnaireCreateProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const data = formToJSON(
      event.target as HTMLFormElement,
    ) as QuestionnaireCreateForm;
    const curOptoins = data.options;

    const emitData: Question = {
      ...data,
      options: curOptoins
        ? typeof curOptoins === 'string'
          ? [curOptoins]
          : curOptoins
        : undefined,
    };

    onAdd(emitData);
  };

  return (
    <div className="container-fluid">
      <Form onSubmit={handleSubmit}>
        <Row as="ul" className="list-unstyled w-100 align-items-end">
          <Col sm={4}>
            <Form.Group as="li" className="mb-2 w-20" key="id" controlId="id">
              <Form.Label>
                {t('question_id')}
                {t('quote_required')}
              </Form.Label>
              <Form.Control name={'id'} required />
            </Form.Group>
          </Col>
          <Col sm={8}>
            <Form.Group
              as="li"
              className="mb-2 flex-grow-1"
              key="title"
              controlId="title"
            >
              <Form.Label>
                {t('question_description')}
                {t('quote_required')}
              </Form.Label>
              <Form.Control name={'title'} required />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group as="li" className="mb-2" key="type" controlId="type">
              <Form.Label>{t('question_type')}</Form.Label>
              <Form.Select name="type">
                <option value="text">{t('text')}</option>
                <option value="url">{t('link')}</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col sm={8}>
            <Form.Group
              as="li"
              className="mb-2"
              key="options"
              controlId="options"
            >
              <Form.Label>{t('option_config')}</Form.Label>
              <BadgeInput name="options" placeholder={t('tag_placeholder')} />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group
              as="li"
              className="mb-2"
              key="multiple"
              controlId="multiple"
            >
              <Form.Label>{t('whether_multiple')}</Form.Label>
              <Form.Select name="multiple">
                <option value="false">{t('no')}</option>
                <option value="true">{t('yes')}</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group as="li" className="mb-2 " key="required">
              <Form.Label>{t('whether_required')}</Form.Label>
              <Form.Select name="required">
                <option value="false">{t('no')}</option>
                <option value="true">{t('yes')}</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Button className="px-5 mb-2" type="submit" variant="success">
              {t('add_question')}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
