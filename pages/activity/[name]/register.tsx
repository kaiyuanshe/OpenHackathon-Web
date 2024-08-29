import { Extension } from '@kaiyuanshe/openhackathon-service';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import {
  cache,
  compose,
  errorLogger,
  JWTProps,
  jwtVerifier,
  translator,
} from 'next-ssr-middleware';
import { FormEvent, PureComponent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { QuestionnaireForm } from '../../../components/Activity/QuestionnairePreview';
import { PageHead } from '../../../components/layout/PageHead';
import { ServerSessionBox } from '../../../components/User/ServerSessionBox';
import activityStore, { ActivityModel } from '../../../models/Activity';
import { Question } from '../../../models/Activity/Question';
import { i18n } from '../../../models/Base/Translation';

const { t } = i18n;

interface RegisterPageProps extends JWTProps {
  activity: string;
  questionnaire: Question[];
}

export const getServerSideProps = compose<{ name: string }, RegisterPageProps>(
  jwtVerifier(),
  cache(),
  errorLogger,
  translator(i18n),
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
export default class RegisterPage extends PureComponent<RegisterPageProps> {
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { activity } = this.props,
      data = formToJSON(event.target as HTMLFormElement);

    const extensions = Object.entries(data)
      .map(([name, value]) => value && { name, value: value + '' })
      .filter(Boolean) as Extension[];

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
      <ServerSessionBox className="container" {...this.props}>
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
      </ServerSessionBox>
    );
  }
}
