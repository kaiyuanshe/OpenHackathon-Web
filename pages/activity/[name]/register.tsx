import { textJoin } from 'mobx-i18n';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { FormEvent, PureComponent } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import PageHead from '../../../components/layout/PageHead';
import { SessionBox } from '../../../components/User/SessionBox';
import activityStore, { ActivityModel } from '../../../models/Activity';
import { Extensions, Question } from '../../../models/Question';
import { i18n } from '../../../models/Translation';
import { withErrorLog, withTranslation } from '../../api/core';

const { t } = i18n;

export const getServerSideProps = withErrorLog<
  { name: string },
  { activity: string; questionnaire: Question[] }
>(
  withTranslation(async ({ params: { name } = {} }) => {
    const { status } = await new ActivityModel().getOne(name!);
    const { body } = await activityStore.getQuestionnaire(name!);
    const questionnaire = body!.extensions.map(
      v => JSON.parse(v.value) as Question,
    );
    return {
      notFound: status !== 'online',
      props: { activity: name!, questionnaire },
    };
  }),
);

class RegisterPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { activity } = this.props,
      data = formToJSON(event.target as HTMLFormElement);

    const extensions = Object.entries(data)
      .map(
        ([name, value]) =>
          value && {
            name,
            value: value + '',
          },
      )
      .filter(Boolean) as Extensions[];

    await activityStore.signOne(activity, extensions);

    self.alert(
      textJoin(t('hackathons'), activity, t('registration_needs_review')),
    );
    location.href = `/activity/${activity}`;
  };

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
      <Form.Group as="li" className="mb-3 " key={title} controlId={title}>
        {title}
        <Row className="mt-2">
          <Form.Label></Form.Label>
          <Form.Control name={title} {...props} />
        </Row>
      </Form.Group>
    );

  render() {
    const { activity, questionnaire } = this.props,
      { uploading } = activityStore;

    return (
      <SessionBox auto className="container">
        <PageHead title={`${activity} ${t('questionnaire')}`} />

        <Form onSubmit={this.handleSubmit}>
          <legend className="text-center">{t('questionnaire')}</legend>
          <small className="text-muted mt-2">
            {t('please_complete_all_mandatory_fields_before_you_proceed')}
            <Link href="https://ophapiv2-demo.authing.cn/u" passHref>
              <a className="text-primary ms-2"> {t('personal_profile')}</a>
            </Link>
          </small>
          <ol className="my-3">{questionnaire.map(this.renderField)}</ol>

          <footer className="text-center my-2">
            <Button
              className="px-5"
              type="submit"
              variant="success"
              disabled={uploading > 0}
            >
              {t('enter_for')}
            </Button>
          </footer>
        </Form>
      </SessionBox>
    );
  }
}

export default RegisterPage;
