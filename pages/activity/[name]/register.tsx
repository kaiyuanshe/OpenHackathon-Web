import { Answer } from '@kaiyuanshe/openhackathon-service';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { cache, compose, errorLogger, JWTProps } from 'next-ssr-middleware';
import { FormEvent } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { QuestionnaireForm } from '../../../components/Activity/QuestionnairePreview';
import { PageHead } from '../../../components/layout/PageHead';
import activityStore, { ActivityModel } from '../../../models/Activity';
import { Question } from '../../../models/Activity/Question';
import { i18n, I18nContext } from '../../../models/Base/Translation';
import { sessionGuard } from '../../api/core';

interface RegisterPageProps extends JWTProps {
  activity: string;
  questionnaire: Question[];
}

export const getServerSideProps = compose<{ name: string }>(
  sessionGuard,
  cache(),
  errorLogger,
  async ({ params: { name } = {} }) => {
    const activityStore = new ActivityModel();
    const { status } = await activityStore.getOne(name!),
      questionnaire = await activityStore.getQuestionnaire(name!);

    return {
      notFound: status !== 'online',
      props: { activity: name!, questionnaire },
    };
  },
);

@observer
export default class RegisterPage extends ObservedComponent<RegisterPageProps, typeof i18n> {
  static contextType = I18nContext;

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { t } = this.observedContext,
      { activity } = this.props,
      data = formToJSON(event.target as HTMLFormElement);

    const answers = Object.entries(data)
      .map(([title, content]) => content && { title, content: content + '' })
      .filter(Boolean) as Answer[];

    await activityStore.signOne(activity, answers);

    alert(textJoin(t('hackathons'), activity, t('registration_needs_review')));

    location.href = `/activity/${activity}`;
  };

  render() {
    const { t } = this.observedContext,
      { activity, questionnaire } = this.props,
      { uploading } = activityStore;

    return (
      <Container>
        <PageHead title={`${activity} ${t('questionnaire')}`} />

        <Form onSubmit={this.handleSubmit}>
          <QuestionnaireForm fields={questionnaire} />

          <footer className="text-center my-2">
            <Button className="px-5" type="submit" variant="success" disabled={uploading > 0}>
              {t('enter_for')}
            </Button>
          </footer>
        </Form>
      </Container>
    );
  }
}
