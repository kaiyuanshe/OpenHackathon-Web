import { observer } from 'mobx-react';
import { NewData } from 'mobx-restful';
import { InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import {
  AwardList,
  AwardTargetName,
} from '../../../../components/Activity/AwardList';
import activityStore from '../../../../models/Activity';
import { Award } from '../../../../models/Award';
import { i18n } from '../../../../models/Translation';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

const { t } = i18n;

@observer
class AwardPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
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
    const {
      id = '',
      name = '',
      description = '',
      quantity,
      target,
    } = this.store.currentOne;
    const loading = this.store.uploading > 0;

    return (
      <Form
        className="text-nowrap"
        onReset={this.handleReset}
        onSubmit={this.handleSubmit}
      >
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="3">
            {t('name')}
          </Form.Label>

          <Col sm="9">
            <Form.Control
              name="name"
              maxLength={64}
              required
              defaultValue={name}
            />
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
              {Object.entries(AwardTargetName).map(([value, name]) => (
                <option
                  key={name}
                  value={value}
                  defaultChecked={value === target}
                >
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
          <Button
            type="submit"
            variant={id ? 'warning' : 'success'}
            disabled={loading}
          >
            {id ? t('update') : t('add')}
            {t('award')}
          </Button>
        </Col>
      </Form>
    );
  };

  render() {
    const { resolvedUrl, params } = this.props.route,
      { store } = this;

    return (
      <ActivityManageFrame
        name={params!.name}
        path={resolvedUrl}
        title={t('prize_settings')}
      >
        <Row xs="1" sm="2" className="my-3">
          <Col sm="4" md="4">
            {this.renderForm()}
          </Col>
          <Col className="flex-fill">
            <AwardList
              store={store}
              onDelete={this.handleReset}
              onEdit={this.handleReset}
            />
          </Col>
        </Row>
      </ActivityManageFrame>
    );
  }
}

export default AwardPage;
