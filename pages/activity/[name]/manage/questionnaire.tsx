import { Question } from '@kaiyuanshe/openhackathon-service';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { QuestionnaireCreate } from '../../../../components/Activity/QuestionnaireCreate';
import { QuestionnaireForm } from '../../../../components/Activity/QuestionnairePreview';
import { QuestionnaireTable } from '../../../../components/Activity/QuestionnaireTable';
import { isServer } from '../../../../configuration';
import activityStore from '../../../../models/Activity';
import { i18n, I18nContext } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

type ActivityQuestionnairePageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const ActivityQuestionnairePage: FC<ActivityQuestionnairePageProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <ActivityManageFrame
      {...props}
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('edit_questionnaire')}
    >
      <ActivityQuestionnaireEditor {...props} />
    </ActivityManageFrame>
  );
});
export default ActivityQuestionnairePage;

@observer
class ActivityQuestionnaireEditor extends ObservedComponent<
  ActivityQuestionnairePageProps,
  typeof i18n
> {
  static contextType = I18nContext;

  activity = this.props.route.params!.name;

  @observable
  accessor isCreate = true;

  async componentDidMount() {
    if (isServer() || !this.activity) return;

    // 获取问卷是否存在
    try {
      const { length } = await activityStore.getQuestionnaire(this.activity);

      this.isCreate = !length;
    } catch {
      //
    }
  }

  createRegister = async () => {
    const { t } = this.observedContext,
      { questionnaire } = activityStore;

    if (!questionnaire[0]) return self.alert(t('please_add_question'));

    await activityStore.updateQuestionnaire(questionnaire, this.activity);

    alert(this.isCreate ? t('create_questionnaire_success') : t('update_questionnaire_success'));

    this.isCreate = false;
  };

  deleteRegister = async () => {
    const { t } = this.observedContext;

    if (!confirm(t('confirm_to_delete_questionnaire'))) return;

    await activityStore.updateQuestionnaire([], this.activity);

    alert(t('delete_questionnaire_success'));

    this.isCreate = true;
  };

  addQuestionnaireItem = (questionnaireItem: Question) => {
    const { t } = this.observedContext;

    if (activityStore.questionnaire.find(({ id }) => id === questionnaireItem.id))
      return alert(t('question_id_repeat'));

    return activityStore.editQuestionnaireStatus([
      ...activityStore.questionnaire,
      questionnaireItem,
    ]);
  };

  deleteQuestionnaireItem = (id: string) => {
    const curQuestionnaire = activityStore.questionnaire.filter(v => v.id !== id);

    return activityStore.editQuestionnaireStatus(curQuestionnaire);
  };

  handleMoveQuestionnaireItem = (id: string, direction: number) => {
    const curQuestionnaire = [...activityStore.questionnaire];
    /* eslint "prefer-destructuring": ["off"] */
    const index = curQuestionnaire.findIndex(v => v.id === id);

    curQuestionnaire[index] = curQuestionnaire.splice(
      index + direction,
      1,
      curQuestionnaire[index],
    )[0];

    return activityStore.editQuestionnaireStatus(curQuestionnaire);
  };

  render() {
    const { t } = this.observedContext,
      { questionnaire } = activityStore;

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
              {this.isCreate ? t('create_questionnaire') : t('update_questionnaire')}
            </Button>
            {this.isCreate ? null : (
              <Button className="px-5" variant="danger" onClick={this.deleteRegister}>
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
