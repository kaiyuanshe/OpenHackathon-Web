import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { QuestionnaireForm } from '../../../components/Activity/QuestionnairePreview';
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
    const activityStore = new ActivityModel();
    const { status } = await activityStore.getOne(name!),
      questionnaire = await activityStore.getQuestionnaire(name!);

    return {
      notFound: status !== 'online',
      props: { activity: name!, questionnaire },
    };
  }),
);

@observer
export default class RegisterPage extends PureComponent<
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

  render() {
    const { activity, questionnaire } = this.props,
      { uploading } = activityStore;

    return (
      <SessionBox auto className="container">
        <PageHead title={`${activity} ${t('questionnaire')}`} />

        <Form onSubmit={this.handleSubmit}>
          <QuestionnaireForm fields={questionnaire} />

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
