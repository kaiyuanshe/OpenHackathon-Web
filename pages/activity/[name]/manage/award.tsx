import { NewData } from 'mobx-restful';
import { FormEvent, PureComponent, createRef } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { formToJSON } from 'web-utility';

import PageHead from '../../../../components/PageHead';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { AwardList, AwardTargetName } from '../../../../components/AwardList';
import { Award } from '../../../../models/Award';

interface AwardPageProps {
  activity: string;
  path: string;
}

export const getServerSideProps = ({
  params: { name } = {},
  req,
}: GetServerSidePropsContext<{ name?: string }>) =>
  !name
    ? {
        notFound: true,
        props: {} as AwardPageProps,
      }
    : {
        props: { activity: name, path: req.url },
      };

class AwardPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  awardList = createRef<AwardList>();
  form = createRef<HTMLFormElement>();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store } = this.awardList.current || {},
      form = this.form.current;

    if (!store || !form) return;

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
    } = this.awardList.current?.store.currentOne || {};

    return (
      <Form
        className="text-nowrap"
        ref={this.form}
        onSubmit={this.handleSubmit}
      >
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="2">
            名称
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
            描述
          </Form.Label>
          <Col sm="10">
            <Form.Control
              name="description"
              aria-label="描述"
              maxLength={256}
              required
              defaultValue={description}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="2">
            权重
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
            类型
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
          <Button type="reset" variant="danger">
            清空表单
          </Button>
          <Button type="submit" variant={id ? 'warning' : 'success'}>
            {id ? '更新' : '新增'}奖项
          </Button>
        </Col>
      </Form>
    );
  };

  render() {
    const { path, activity } = this.props;

    return (
      <ActivityManageFrame name={activity} path={path}>
        <PageHead title={`${activity}活动管理 奖项设置`} />

        <Row xs="1" sm="2" className="my-3">
          <Col sm="4" md="4">
            {this.renderForm()}
          </Col>
          <Col className="flex-fill">
            <AwardList
              ref={this.awardList}
              activity={activity}
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
