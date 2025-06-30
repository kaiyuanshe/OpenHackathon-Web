import { Loading } from 'idea-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { FormField, RangeInput } from 'mobx-restful-table';
import { FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { EvaluationModel } from '../../models/Activity/Evaluation';
import { i18n, I18nContext } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';

export interface EvaluationFormProps {
  activityName: string;
  teamId: number;
}

@observer
export class EvaluationForm extends ObservedComponent<EvaluationFormProps, typeof i18n> {
  static contextType = I18nContext;

  evaluationStore = new EvaluationModel(this.props.activityName, this.props.teamId);

  @computed
  get evaluatable() {
    return !!sessionStore.user && !this.evaluationStore.currentPage[0];
  }

  async componentDidMount() {
    await this.evaluationStore.getStandard();

    const { user } = sessionStore;

    if (user)
      await this.evaluationStore.getList({ createdBy: user.id, team: this.props.teamId }, 1);
  }

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = formToJSON(event.currentTarget);

    await this.evaluationStore.updateOne(form);

    alert('Evaluation submitted successfully!');
  };

  render() {
    const { t } = this.observedContext,
      { evaluatable } = this;
    const { downloading, uploading, currentStandard, currentPage } = this.evaluationStore;
    const { dimensions } = currentStandard,
      [{ scores } = {}] = currentPage;
    const loading = downloading > 0 || uploading > 0;

    return (
      <Form className="d-flex flex-column gap-3" onSubmit={this.handleSubmit}>
        {loading && <Loading />}

        {dimensions.map(({ name, description, maximuScore }) => {
          const { score, reason } = scores?.find(({ dimension }) => dimension === name) || {};

          return (
            <fieldset key={name} name="scores">
              <legend>{name}</legend>
              <p>{description}</p>

              <input type="hidden" name="dimension" value={name} />
              <RangeInput
                className="text-warning"
                icon={value => (value ? '★' : '☆')}
                name="score"
                max={maximuScore}
                required
                disabled={!evaluatable}
                defaultValue={score?.toString()}
              />
              <FormField
                label={t('judges_review')}
                as="textarea"
                rows={3}
                disabled={!evaluatable}
                defaultValue={reason}
              />
            </fieldset>
          );
        })}
        <Button type="submit" variant="primary" disabled={!evaluatable}>
          {t('submit')}
        </Button>
      </Form>
    );
  }
}
