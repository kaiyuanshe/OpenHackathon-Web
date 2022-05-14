import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import {
  ChangeEventHandler,
  FormEvent,
  MouseEventHandler,
  PureComponent,
  SyntheticEvent,
} from 'react';
import {
  Form,
  Table,
  Row,
  Col,
  Button,
  FormControlProps,
  FormControl,
} from 'react-bootstrap';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { ActivityManageFrame } from '../../../../components/ActivityManageFrame';
import PageHead from '../../../../components/PageHead';
import styles from '../../../../styles/Table.module.less';
import { requestClient } from '../../../api/core';
import { ListData } from '../../../../models/Base';
import { Award } from '../../../../models/Award';
import { formToJSON } from 'web-utility';

interface State {
  currentAward: {
    id?: string;
    name: string;
    description: string;
    quantity: number | '';
    target: 'team' | 'individual';
  };
  awardList: Award[];
}

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

export async function getServerSideProps({
  params: { name } = {},
  req,
}: GetServerSidePropsContext<{ name?: string }>) {
  if (!name)
    return {
      notFound: true,
      props: {} as AwardPageProps,
    };
  const { value: awardList } = await requestClient<ListData<Award>>(
    `hackathon/${name}/awards`,
  );

  return {
    props: {
      activity: name,
      path: req.url,
      awardList,
    },
  };
}

class AwardPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>,
  State
> {
  state: Readonly<State> = {
    currentAward: {
      id: '',
      name: '',
      description: '',
      quantity: '',
      target: 'team',
    },
    awardList: this.props.awardList,
  };
  handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const { method } = event.nativeEvent.submitter?.dataset! as {
        method: 'PUT' | 'PATCH';
      },
      { activity } = this.props,
      data = formToJSON(event.target as HTMLFormElement);

    await requestClient(`hackathon/${activity}/award/${data.id}`, method, data);
    const { value: awardList } = await requestClient<ListData<Award>>(
      `hackathon/${activity}/awards`,
    );

    this.setState({
      currentAward: {
        id: '',
        name: '',
        description: '',
        quantity: '',
        target: 'team',
      },
      awardList: awardList,
    });
  };
  //代办：handleEdit 和 handleDelete 逻辑类似，可以合并
  handleEdit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { awardid } = event.currentTarget.dataset,
      { activity } = this.props,
      currentAward = await requestClient<Award>(
        `hackathon/${activity}/award/${awardid}`,
      );

    this.setState({
      currentAward: {
        id: currentAward.id,
        name: currentAward.name,
        description: currentAward.description,
        quantity: currentAward.quantity,
        target: currentAward.target,
      },
    });
  };

  handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget,
      { activity } = this.props;
    await requestClient(`hackathon/${activity}/award/${id}`, 'DELETE');
    const { value: awardList } = await requestClient<ListData<Award>>(
      `hackathon/${activity}/awards`,
    );
    this.setState({
      awardList: awardList,
    });
  };
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
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
      <Form className="text-nowrap" onSubmit={this.handleSubmit}>
        <Form.Control type="hidden" name="id" value={id} />
        <Form.Group as={Row} className="p-2">
          <Form.Label column sm="2">
            名称
          </Form.Label>

          <Col sm="10">
            <Form.Control
              name="name"
              value={name}
              onChange={this.handleChange}
              maxLength={64}
              required
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
              value={description}
              onChange={this.handleChange}
              maxLength={256}
              required
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
              value={quantity}
              onChange={this.handleChange}
              max={10000}
              min={1}
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
        <Col className="d-flex justify-content-between p-4">
          <Button type="reset" variant="danger">
            清空表单
          </Button>
          <Button
            type="submit"
            variant={id ? 'warning' : 'success'}
            data-method={id ? 'PATCH' : 'PUT'}
          >
            {id ? '更新' : '新增'}奖项
          </Button>
        </Col>
      </Form>
    );
  };

  renderItem = (
    { quantity, target, pictures, name, description, id }: Award,
    index: number,
  ) => (
    <tr>
      <td>{quantity}</td>
      <td>{AwardTargetName[target]}</td>
      <td>
        {pictures! && (
          <Image src={pictures?.[0].uri} alt={pictures?.[0].description} />
        )}
      </td>
      <td>
        <Button variant="link" onClick={this.handleEdit} data-awardid={id}>
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
    const { path, activity } = this.props;
    return (
      <ActivityManageFrame path={path}>
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
              <tbody>{this.state.awardList.map(this.renderItem)}</tbody>
            </Table>
          </Col>
        </Row>
      </ActivityManageFrame>
    );
  }
}

export default AwardPage;
