import { ChangeEvent, FormEvent, MouseEvent, PureComponent } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { Image, Form, Table, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { formToJSON } from 'web-utility';

import PageHead from '../../../../components/PageHead';
import { ActivityManageFrame } from '../../../../components/ActivityManageFrame';
import styles from '../../../../styles/Table.module.less';
import { request, requestClient } from '../../../api/core';
import { withSession } from '../../../api/user/session';
import { ListData } from '../../../../models/Base';
import { Award } from '../../../../models/Award';

interface State {
  currentAward: Partial<Award>;
  awardList: Award[];
}

const DEFAULT_STATE: Partial<Award> = {
  id: '',
  name: '',
  description: '',
  quantity: 1,
  target: 'team',
};

interface AwardPageProps {
  activity: string;
  path: string;
  awardList: Award[];
}

const awardTableHead = ['权重', '类型', '照片', '名称', '描述', '操作'],
  AwardTargetName = {
    individual: '个人',
    team: '团队',
  };

export const getServerSideProps = withSession(
  async ({
    params: { name } = {},
    req,
  }: GetServerSidePropsContext<{ name?: string }>) => {
    if (!name)
      return {
        notFound: true,
        props: {} as AwardPageProps,
      };

    const { value: awardList } = await request<ListData<Award>>(
      `hackathon/${name}/awards`,
      'GET',
      undefined,
      { req },
    );
    return {
      props: {
        activity: name,
        path: req.url,
        awardList,
      },
    };
  },
);

class AwardPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>,
  State
> {
  state: Readonly<State> = {
    currentAward: DEFAULT_STATE,
    awardList: this.props.awardList,
  };

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const method = event.currentTarget.getAttribute('method') as
        | 'PUT'
        | 'PATCH',
      { activity } = this.props,
      { id = '', ...data } = formToJSON<Award>(event.currentTarget);

    await requestClient(`hackathon/${activity}/award/${id}`, method, data);

    const { value: awardList } = await requestClient<ListData<Award>>(
      `hackathon/${activity}/awards`,
    );
    this.setState({
      currentAward: DEFAULT_STATE,
      awardList,
    });
  };

  handleReset = () =>
    this.setState({
      currentAward: DEFAULT_STATE,
    });

  //代办：handleEdit 和 handleDelete 逻辑类似，可以合并
  handleEdit = async ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    const { awardId } = currentTarget.dataset,
      { activity } = this.props;

    const currentAward = await requestClient<Award>(
      `hackathon/${activity}/award/${awardId}`,
    );
    this.setState({ currentAward });
  };

  handleDelete = async ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    const { id } = currentTarget,
      { activity } = this.props;

    if (!confirm('确定删除该奖项？')) return;

    await requestClient(`hackathon/${activity}/award/${id}`, 'DELETE');

    const { value: awardList } = await requestClient<ListData<Award>>(
      `hackathon/${activity}/awards`,
    );
    this.setState({
      currentAward: DEFAULT_STATE,
      awardList,
    });
  };

  handleChange = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = currentTarget;

    this.setState(prevState => ({
      currentAward: { ...prevState.currentAward, ...{ [name]: value } },
    }));
  };

  renderForm = () => {
    const { currentAward } = this.state;
    const {
      id = '',
      name = '',
      description = '',
      quantity,
      target,
    } = currentAward;

    return (
      <Form
        className="text-nowrap"
        method={id ? 'PATCH' : 'PUT'}
        onSubmit={this.handleSubmit}
        onReset={this.handleReset}
      >
        <Form.Control type="hidden" name="id" value={id} />
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="2">
            名称
          </Form.Label>

          <Col sm="10">
            <Form.Control
              name="name"
              maxLength={64}
              required
              value={name}
              onChange={this.handleChange}
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
              value={description}
              onChange={this.handleChange}
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
              value={quantity}
              onChange={this.handleChange}
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
                <option value={value} selected={value === target} key={name}>
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

  renderItem = ({
    quantity,
    target,
    pictures,
    name,
    description,
    id,
  }: Award) => (
    <tr key={id}>
      <td>{quantity}</td>
      <td>{AwardTargetName[target]}</td>
      <td>
        {pictures! && (
          <Image src={pictures?.[0].uri} alt={pictures?.[0].description} />
        )}
      </td>
      <td>
        <Button variant="link" onClick={this.handleEdit} data-award-id={id}>
          {name}
        </Button>
      </td>
      <td>{description}</td>
      <td>
        <Button variant="danger" size="sm" onClick={this.handleDelete} id={id}>
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          删除
        </Button>
      </td>
    </tr>
  );

  render() {
    const { path, activity } = this.props,
      { awardList } = this.state;
    return (
      <ActivityManageFrame name={activity} path={path}>
        <PageHead title={`${activity}活动管理 奖项设置`} />
        <Row xs="1" sm="2" className="my-3">
          <Col sm="4" md="4">
            {this.renderForm()}
          </Col>
          <Col className="flex-fill">
            <Table hover responsive="lg" className={styles.table}>
              <thead>
                <tr>
                  {awardTableHead.map((data, idx) => (
                    <th key={idx}>{data}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{awardList.map(this.renderItem)}</tbody>
            </Table>
          </Col>
        </Row>
      </ActivityManageFrame>
    );
  }
}

export default AwardPage;
