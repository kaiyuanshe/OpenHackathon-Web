import { t } from 'i18next';
import { NewData } from 'mobx-restful';
import { InferGetServerSidePropsType } from 'next';
import { createRef, FormEvent, PureComponent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { AwardList, AwardTargetName } from '../../../../components/AwardList';
import activityStore from '../../../../models/Activity';
import { Award } from '../../../../models/Award';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

class AwardPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.awardOf(this.props.route.params!.name);

  form = createRef<HTMLFormElement>();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store } = this,
      form = this.form.current;

    if (!form) return;

    const data = formToJSON<NewData<Award>>(form);

    await store.updateOne(data, store.currentOne.id);
    await store.refreshList();

    store.clearCurrent();
    form.reset();
  };

  handleReset = () => this.form.current?.reset();

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
        ref={this.form}
        onSubmit={this.handleSubmit}
      >
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="2">
            {t('name')}
          </Form.Label>

          <Col sm="10">
            <Form.Control
              name="name"
              maxLength={64}
              required
              defaultValue={name}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="2">
            {t('introduction')}
          </Form.Label>
          <Col sm="10">
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
          <Form.Label column sm="2">
            {t('weights')}
          </Form.Label>
          <Col sm="10">
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
          <Form.Label column sm="2">
            {t('type')}
          </Form.Label>
          <Col sm="10">
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
    const { resolvedUrl, params } = this.props.route;

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
              store={this.store}
              onEdit={this.handleReset}
              onDelete={this.handleReset}
            />
          </Col>
        </Row>
      </ActivityManageFrame>
    );
  }
}

export default AwardPage;
