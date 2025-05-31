import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { NewData } from 'mobx-restful';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, FormEvent, useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { AwardList, AwardTargetName } from '../../../../components/Activity/AwardList';
import activityStore from '../../../../models/Activity';
import { Award } from '../../../../models/Activity/Award';
import { i18n, I18nContext } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

type AwardPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const AwardPage: FC<AwardPageProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <ActivityManageFrame
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('prize_settings')}
    >
      <AwardEditor {...props} />
    </ActivityManageFrame>
  );
});
export default AwardPage;

@observer
class AwardEditor extends ObservedComponent<AwardPageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.awardOf(this.props.route.params!.name);

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store } = this,
      form = event.currentTarget,
      data = formToJSON<NewData<Award>>(form);

    await store.updateOne(data);
    await store.refreshList();

    store.clearCurrent();
    form.reset();
  };

  handleReset = () => this.store.clearCurrent();

  renderForm = () => {
    const i18n = this.observedContext,
      { id = '', name = '', description = '', quantity, target } = this.store.currentOne;
    const { t } = i18n,
      loading = this.store.uploading > 0;

    return (
      <Form className="text-nowrap" onReset={this.handleReset} onSubmit={this.handleSubmit}>
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="3">
            {t('name')}
          </Form.Label>

          <Col sm="9">
            <Form.Control name="name" maxLength={64} required defaultValue={name} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="3">
            {t('introduction')}
          </Form.Label>
          <Col sm="9">
            <Form.Control
              name="description"
              aria-label={t('introduction')}
              maxLength={256}
              required
              defaultValue={description}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="3">
            {t('quantity')}
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="number"
              name="quantity"
              min={1}
              max={10000}
              defaultValue={quantity}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="3">
            {t('type')}
          </Form.Label>
          <Col sm="9">
            <Form.Select name="target">
              {Object.entries(AwardTargetName(i18n)).map(([value, name]) => (
                <option key={name} value={value} defaultChecked={value === target}>
                  {name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>
        <Col className="d-flex justify-content-around p-4">
          <Button type="reset" variant="danger" disabled={loading}>
            {t('clear_form')}
          </Button>
          <Button type="submit" variant={id ? 'warning' : 'success'} disabled={loading}>
            {id ? t('update') : t('add')}
            {t('award')}
          </Button>
        </Col>
      </Form>
    );
  };

  render() {
    const { store } = this;

    return (
      <Row xs="1" sm="2" className="my-3">
        <Col sm="4" md="4">
          {this.renderForm()}
        </Col>
        <Col className="flex-fill">
          <AwardList store={store} />
        </Col>
      </Row>
    );
  }
}
