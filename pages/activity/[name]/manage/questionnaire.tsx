import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { QuestionnaireCreate } from '../../../../components/Activity/QuestionnaireCreate';
import { QuestionnairePreview } from '../../../../components/Activity/QuestionnairePreview';
import { QuestionnaireTable } from '../../../../components/Activity/QuestionnaireTable';
import activityStore from '../../../../models/Activity';
import { isServer } from '../../../../models/Base';
import { Extensions, Question } from '../../../../models/Question';
import { i18n } from '../../../../models/Translation';
import { withRoute } from '../../../api/core';

const { t } = i18n;

export const getServerSideProps = withRoute<{ name: string }>();

@observer
class ActivityQuestionnairePage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  activity = this.props.route.params!.name;

  @observable
  isCreate = true;

  async componentDidMount() {
    if (isServer() || !this.activity) return;

    // 获取问卷是否存在
    try {
      await activityStore.getQuestionnaire(this.activity);
      this.isCreate = false;
    } catch {}
  }

  createRegister = async () => {
    const { questionnaire } = activityStore;

    if (!questionnaire[0]) return self.alert(t('please_add_question'));

    const questions: Extensions[] = questionnaire.map(v => ({
      name: v.id || v.title,
      value: JSON.stringify(v),
    }));

    if (this.isCreate) {
      await activityStore.createQuestionnaire(questions, this.activity);
    } else {
      await activityStore.updateQuestionnaire(questions, this.activity);
    }

    self.alert(
      this.isCreate
        ? t('create_questionnaire_success')
        : t('update_questionnaire_success'),
    );

    this.isCreate = false;
  };

  deleteRegister = async () => {
    if (!confirm(t('confirm_to_delete_questionnaire'))) return;

    await activityStore.deleteQuestionnaire(this.activity);

    self.alert(t('delete_questionnaire_success'));

    this.isCreate = true;
  };

  addQuestionnaireItem = (questionnaireItem: Question) => {
    if (
      activityStore.questionnaire.find(({ id }) => id === questionnaireItem.id)
    )
      return self.alert(t('question_id_repeat'));

    activityStore.editQuestionnaireStatus([
      ...activityStore.questionnaire,
      questionnaireItem,
    ]);
  };

  deleteQuestionnaireItem = async (id: string) => {
    const curQuestionnaire = activityStore.questionnaire.filter(
      v => v.id !== id,
    );

    activityStore.editQuestionnaireStatus(curQuestionnaire);
  };

  handleMoveQuestionnaireItem = async (id: string, direction: number) => {
    const curQuestionnaire = [...activityStore.questionnaire];
    const index = curQuestionnaire.findIndex(v => v.id === id);

    curQuestionnaire[index] = curQuestionnaire.splice(
      index + direction,
      1,
      curQuestionnaire[index],
    )[0];
    activityStore.editQuestionnaireStatus(curQuestionnaire);
  };

  render() {
    const { resolvedUrl, params } = this.props.route;
    const activity = params!.name;
    const { questionnaire } = activityStore;

    return (
      <ActivityManageFrame
        name={activity}
        path={resolvedUrl}
        title={t('edit_questionnaire')}
      >
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
            <QuestionnairePreview questionnaire={questionnaire} />
          </Col>
        </Row>
      </ActivityManageFrame>
    );
  }
}

export default ActivityQuestionnairePage;
