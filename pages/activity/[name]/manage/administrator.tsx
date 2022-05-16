import { SyntheticEvent, ChangeEvent, PureComponent } from 'react';
import {
  Badge,
  Row,
  Col,
  ListGroup,
  Table,
  Form,
  Button,
} from 'react-bootstrap';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formToJSON } from 'web-utility';

import { convertDatetime } from '../../../../utils/time';
import PageHead from '../../../../components/PageHead';
import { ActivityManageFrame } from '../../../../components/ActivityManageFrame';
import { AdministratorModal } from '../../../../components/ActivityAdministratorModal';
import { requestClient } from '../../../api/core';
import { withSession } from '../../../api/user/session';
import { ListData } from '../../../../models/Base';
import { AdminsJudges } from '../../../../models/ActivityManage';
import styles from '../../../../styles/Table.module.less';

interface State {
  show: boolean;
  checked: Record<string, boolean>;
  nextLink: string | null;
  admins: AdminsJudges[];
  judges: AdminsJudges[];
}

interface AdministratorPageProps {
  activity: string;
  path: string;
}

const tableHead = [
  '所有',
  '名称',
  '邮箱',
  '角色类型',
  '状态',
  '帐户来源',
  '最后登录时间',
  '创建时间',
  '备注',
];
//生成一个checked value数列，用于在state中给各个复选框分配checked值
const CheckboxArr = Array.from({ length: 10 }, (e, i) => i + ''),
  DEFAULT_CHECKED = CheckboxArr.reduce(
    (prev, current) => ({ ...prev, [current]: false }),
    {},
  );

export const getServerSideProps = withSession(
  async ({
    params: { name } = {},
    req,
  }: GetServerSidePropsContext<{ name?: string }>) => {
    if (!name)
      return {
        notFound: true,
        props: {} as AdministratorPageProps,
      };

    return {
      props: {
        activity: name,
        path: req.url,
      },
    };
  },
);

class AdministratorPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>,
  State
> {
  state: Readonly<State> = {
    show: false,
    checked: DEFAULT_CHECKED,
    nextLink: null,
    admins: [],
    judges: [],
  };

  //检验：复选框至少选中一个，否则提示验证消息
  componentDidMount() {
    const firstCheckbox =
      document.querySelector<HTMLInputElement>('#checkbox0');
    firstCheckbox?.setCustomValidity('请选择至少一位管理员或裁判！');
    //列表放入state，便于不刷新页面更新内容，放入后列表加载时间好像更长了一些
    this.updateList();
  }
  componentDidUpdate() {
    const firstCheckbox =
      document.querySelector<HTMLInputElement>('#checkbox0');
    firstCheckbox?.setCustomValidity(
      Object.values(this.state.checked).some(check => check)
        ? ''
        : '请选择至少一位管理员或裁判！',
    );
  }

  //处理删除管理员或裁判
  handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    //获取提交按钮id，按此区分事件处理；在这种情况下，event.target为Form，所以需要获取nativeEvent，然后得到id
    const { activity } = this.props;

    //解构赋值获得关键的userId和admin/judge参数
    const { userId } = formToJSON<{
      userId: string | string[];
    }>(event.currentTarget);

    //弹窗确认删除
    const confirmed = window.confirm('确认删除所选管理员/裁判？');
    if (!confirmed) return;
    //formToJSON 如果checkbox值只有一个，返回为string，多个值才返回arr，所以这里把userId都转为数组处理
    const userIdArr = typeof userId === 'string' ? userId.split(',') : userId;
    //批量删除
    for (let item of userIdArr) {
      if (typeof item !== 'string') continue;
      const [user, id] = item.split(':');
      await requestClient(`hackathon/${activity}/${user}/${id}`, 'DELETE');
    }
    // 重新分配checked值
    this.setState({
      checked: DEFAULT_CHECKED,
    });
    //更新列表
    this.updateList();
  };
  //列表更新函数，响应删除与增加管理员事件，传递至下一级子组件ActivityAdministratorModal
  updateList = async () => {
    const { activity } = this.props,
      { value: admins } = await requestClient<ListData<AdminsJudges>>(
        `hackathon/${activity}/admins`,
      ),
      { value: judges } = await requestClient<ListData<AdminsJudges>>(
        `hackathon/${activity}/judges`,
      );
    this.setState({
      admins,
      judges,
    });
  };

  toggleDialog = (show: boolean) => () => this.setState({ show });

  //全选，反选所有用户
  toggleSelectAll = ({
    currentTarget: { checked },
  }: ChangeEvent<HTMLInputElement>) =>
    this.setState(prevState => ({
      checked: Object.fromEntries(
        Object.keys(prevState.checked).map(key => [key, checked]),
      ),
    }));

  handleCheckboxChange = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
    //设置一个自定义标签获取每个checked的名称，从而更改对应的state.checked
    const { key } = currentTarget.dataset;

    this.setState(prevState => ({
      checked: {
        ...prevState.checked,
        [key!]: currentTarget.checked,
      },
    }));
  };

  renderField = (
    {
      createdAt,
      userId,
      user: {
        email,
        nickname,
        lastLogin,
        registerSource: [source],
      },
      description,
    }: AdminsJudges,
    index: number,
  ) => (
    <tr>
      {[
        userId,
        nickname,
        email,
        description ? '裁判' : '管理员',
        createdAt ? '已通过' : '审核中',
        source.split(':')[1],
        convertDatetime(lastLogin),
        convertDatetime(createdAt),
        description,
      ].map((data, idx) =>
        idx ? (
          <td key={idx + userId + createdAt}>{data}</td>
        ) : (
          <td key={idx + userId + createdAt}>
            <Form.Check
              inline
              aria-label={description ? `judge${data}` : `admin${data}`}
              name="userId"
              id={`checkbox${index}`}
              value={description ? `judge:${data}` : `admin:${data}`}
              checked={this.state.checked[index + '']}
              onChange={this.handleCheckboxChange}
              data-key={index + ''}
            />
          </td>
        ),
      )}
    </tr>
  );

  renderList() {
    const { admins, judges } = this.state;
    const all = [...admins, ...judges];

    return (
      <ListGroup>
        <ListGroup.Item className="d-flex justify-content-between">
          全部用户
          <Badge className="ms-2" bg="secondary">
            {all.length}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          管理员
          <Badge className="ms-2" bg="secondary">
            {admins.length}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          裁判
          <Badge className="ms-2" bg="secondary">
            {judges.length}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    );
  }

  render() {
    const { activity, path } = this.props,
      { admins, judges } = this.state,
      value = [...admins, ...judges];

    return (
      <ActivityManageFrame name={activity} path={path}>
        <PageHead title={`${activity}活动管理 管理员`} />
        <Form onSubmit={this.handleSubmit}>
          <Row xs="1" sm="2">
            <Col sm="auto" md="auto">
              {this.renderList()}

              <Col className="d-flex flex-column">
                <Button
                  variant="success"
                  className="my-3"
                  onClick={this.toggleDialog(true)}
                >
                  <FontAwesomeIcon className="me-2" icon={faPlus} />
                  增加
                </Button>
                <Button variant="danger" type="submit" id="delete">
                  <FontAwesomeIcon className="me-2" icon={faTrash} />
                  删除
                </Button>
              </Col>
            </Col>
            <Col className="flex-fill">
              <Table hover responsive="lg" className={styles.table}>
                <thead>
                  <tr>
                    {tableHead.map((data, idx) =>
                      idx ? (
                        <th key={idx + data}>{data}</th>
                      ) : (
                        <th key={idx + data}>
                          <Form.Check
                            inline
                            aria-label="selectAll"
                            id="selectAll"
                            type="checkbox"
                            name="selectAll"
                            onChange={this.toggleSelectAll}
                          />
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>{value?.map(this.renderField)}</tbody>
              </Table>
            </Col>
          </Row>
        </Form>

        <AdministratorModal
          show={this.state.show}
          activity={activity}
          onHide={this.toggleDialog(false)}
          updateList={this.updateList}
        />
      </ActivityManageFrame>
    );
  }
}

export default AdministratorPage;
