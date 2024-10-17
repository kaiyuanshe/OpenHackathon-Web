import { Question } from '@kaiyuanshe/openhackathon-service';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { Component, FC } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { QuestionnaireCreate } from '../../../../components/Activity/QuestionnaireCreate';
import { QuestionnaireForm } from '../../../../components/Activity/QuestionnairePreview';
import { QuestionnaireTable } from '../../../../components/Activity/QuestionnaireTable';
import activityStore from '../../../../models/Activity';
import { t } from '../../../../models/Base/Translation';
import { isServer } from '../../../../models/User/Session';
import { sessionGuard } from '../../../api/core';

type ActivityQuestionnairePageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(
  router,
  sessionGuard,
);

const ActivityQuestionnairePage: FC<ActivityQuestionnairePageProps> = observer(
  props => (
    <ActivityManageFrame
      {...props}
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('edit_questionnaire')}
    >
      <ActivityQuestionnaireEditor {...props} />
    </ActivityManageFrame>
  ),
);
export default ActivityQuestionnairePage;

@observer
class ActivityQuestionnaireEditor extends Component<ActivityQuestionnairePageProps> {
  activity = this.props.route.params!.name;

  @observable
  accessor isCreate = true;

  async componentDidMount() {
    if (isServer() || !this.activity) return;

    // 获取问卷是否存在
    try {
      const { length } = await activityStore.getQuestionnaire(this.activity);

      this.isCreate = !length;
    } catch {}
  }

  createRegister = async () => {
    const { questionnaire } = activityStore;

    if (!questionnaire[0]) return self.alert(t('please_add_question'));

    await activityStore.updateQuestionnaire(questionnaire, this.activity);

    self.alert(
      this.isCreate
        ? t('create_questionnaire_success')
        : t('update_questionnaire_success'),
    );
    this.isCreate = false;
  };

  deleteRegister = async () => {
    if (!confirm(t('confirm_to_delete_questionnaire'))) return;

    await activityStore.updateQuestionnaire([], this.activity);

    self.alert(t('delete_questionnaire_success'));

    this.isCreate = true;
  };

  addQuestionnaireItem = (questionnaireItem: Question) => {
    if (
      activityStore.questionnaire.find(({ id }) => id === questionnaireItem.id)
    )
      return self.alert(t('question_id_repeat'));

    return activityStore.editQuestionnaireStatus([
      ...activityStore.questionnaire,
      questionnaireItem,
    ]);
  };

  deleteQuestionnaireItem = (id: string) => {
    const curQuestionnaire = activityStore.questionnaire.filter(
      v => v.id !== id,
    );
    return activityStore.editQuestionnaireStatus(curQuestionnaire);
  };

  handleMoveQuestionnaireItem = (id: string, direction: number) => {
    const curQuestionnaire = [...activityStore.questionnaire];
    const index = curQuestionnaire.findIndex(v => v.id === id);

    curQuestionnaire[index] = curQuestionnaire.splice(
      index + direction,
      1,
      curQuestionnaire[index],
    )[0];
    return activityStore.editQuestionnaireStatus(curQuestionnaire);
  };

  render() {
    const { questionnaire } = activityStore;

    return (
      <Row className="gx-10">
        <Col sm={12}>
          <QuestionnaireCreate onAdd={this.addQuestionnaireItem} />
          <QuestionnaireTable
            questionnaire={questionnaire}
            onDelete={this.deleteQuestionnaireItem}
            onMove={this.handleMoveQuestionnaireItem}
          />
          <footer className="text-center">
            <Button className="mx-1 px-5" onClick={this.createRegister}>
              {this.isCreate
                ? t('create_questionnaire')
                : t('update_questionnaire')}
            </Button>
            {this.isCreate ? null : (
              <Button
                className="px-5"
                variant="danger"
                onClick={this.deleteRegister}
              >
                {t('delete_questionnaire')}
              </Button>
            )}
          </footer>
        </Col>
        <Col sm={12} className="p-2">
          <h5 className="mx-2">{t('preview_questionnaire')}</h5>

          <QuestionnaireForm fields={questionnaire} />
        </Col>
      </Row>
    );
  }
}
