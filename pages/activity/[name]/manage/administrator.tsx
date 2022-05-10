import { PureComponent, SyntheticEvent } from 'react';
import { Row, Col, Table, Form, ListGroup, Button } from 'react-bootstrap';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formToJSON, JSONValue, URLData } from 'web-utility';
import { ActivityManageFrame } from '../../../../components/ActivityManageFrame';
import PageHead from '../../../../components/PageHead';
import { requestClient } from '../../../api/core';
import { AdminsJudges } from '../../../../models/ActivityManage';
import { User } from '../../../../models/User';
import { ListData } from '../../../../models/Base';
import { convertDatetime } from '../../../../components/time';
import { AdministratorModal } from '../../../../components/ActivityAdministratorModal';
import styles from '../../../../styles/Table.module.less';
interface State {
  show: boolean;
  checked: Record<string, boolean>;

  nextLink?: string | null;
  list: User[];
}

interface AdministratorPageProps {
  activity: string;
  path: string;
  admins: AdminsJudges[];
  judges: AdminsJudges[];
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
const CheckboxArr = Array.from({ length: 10 }, (e, i) => i.toString());

export async function getServerSideProps({
  params: { name } = {},
  req,
}: GetServerSidePropsContext<{ name?: string }>) {
  if (!name)
    return {
      notFound: true,
      props: {} as AdministratorPageProps,
    };
  const { value: admins } = await requestClient<ListData<AdminsJudges>>(
      `hackathon/${name}/admins`,
    ),
    { value: judges } = await requestClient<ListData<AdminsJudges>>(
      `hackathon/${name}/judges`,
    );
  return {
    props: {
      activity: name,
      path: req.url,
      admins,
      judges,
    },
  };
}

class AdministratorPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>,
  State
> {
  state: Readonly<State> = {
    show: false,
    checked: CheckboxArr.reduce(
      (prev, current) => ({ ...prev, [current]: false }),
      {},
    ),

    list: [],
  };

  //检验：复选框至少选中一个，否则提示验证消息
  componentDidMount() {
    const firstCheckbox =
      document.querySelector<HTMLInputElement>('#checkbox0');
    firstCheckbox?.setCustomValidity('请选择至少一位管理员或裁判！');
  }
  componentDidUpdate() {
    const firstCheckbox =
      document.querySelector<HTMLInputElement>('#checkbox0');
    if (Object.values(this.state.checked).some(check => check))
      return firstCheckbox?.setCustomValidity('');
  }

  //处理三处表单提交，1. 搜索用户 2. 增加管理员/裁判，3. 删除管理员/裁判
  handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    //获取提交按钮id，按此区分事件处理；在这种情况下，event.target为Form，所以需要获取nativeEvent，然后得到id
    const { id } = event.nativeEvent.submitter!;

    //解构赋值获得关键的userId和admin/judge参数
    const data = formToJSON(event.target as HTMLFormElement),
      { userId, adminJudge, userSearch, description } = data,
      { activity } = this.props;
    switch (id) {
      case 'search':
        const { value: searchResult } = await requestClient<ListData<User>>(
          `user/search?keyword=${userSearch}`,
          'POST',
        );
        if (!searchResult?.[0]) return alert('您要查询的用户不存在');
        this.setState({
          list: [...searchResult],
        });
        break;
      case 'increase':
        if (!userId) return alert('请先搜索并选择一位用户');
        await requestClient(
          `hackathon/${activity}/${adminJudge}/${userId}`,
          'PUT',
          { description },
        );

        self.alert('已知悉您的请求，正在处理中！');
        location.href = `/activity/${activity}/manage/administrator`;
        this.setState({
          show: false,

          list: [],
        });

        break;
      case 'delete':
        //弹窗确认删除
        const confirmed = window.confirm('确认删除所选管理员/裁判？');
        if (!confirmed) return;
        //formToJSON 如果checkbox值只有一个，返回为string，多个值才返回arr，所以这里把userId都转为数组处理
        let userIdArr: (JSONValue | URLData<unknown>)[] = [];
        typeof userId === 'string'
          ? (userIdArr = userId.split(','))
          : Array.isArray(userId)
          ? (userIdArr = [...userId])
          : userId;

        //批量删除
        for (let item of userIdArr) {
          if (typeof item !== 'string') continue;
          const [user, id] = item.split(':');
          await requestClient(`hackathon/${activity}/${user}/${id}`, 'DELETE');
        }
        location.href = `/activity/${activity}/manage/administrator`;
        break;
    }
  };

  handleShow = () => {
    this.setState({
      show: true,
    });
  };
  handleClose = () => {
    this.setState({
      show: false,
    });
  };

  handleReset = () => {
    this.setState({
      list: [],
    });
  };

  toggleSelectAll = ({
    currentTarget: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(prevState => ({
      checked: Object.fromEntries(
        Object.keys(prevState.checked).map(key => [key, checked]),
      ),
    }));
  };
  handleCheckboxChange = ({
    currentTarget,
  }: React.ChangeEvent<HTMLInputElement>) => {
    //设置一个自定义标签获取每个checked的名称，从而更改对应的state.checked
    const dataKey = currentTarget.getAttribute('data-key'),
      checked = currentTarget.checked;
    this.setState(prevState => ({
      checked: {
        ...prevState.checked,
        [dataKey!]: checked,
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
          <td key={idx + data!}>{data}</td>
        ) : (
          <td key={idx + data!}>
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

  render() {
    const { activity, path, admins, judges } = this.props,
      value = [...admins, ...judges];

    return (
      <ActivityManageFrame path={path}>
        <PageHead title={`${activity}活动管理 管理员`} />
        <Form onSubmit={this.handleSubmit}>
          <Row xs="1" sm="2">
            <Col sm="auto" md="auto">
              <ListGroup>
                <ListGroup.Item>全部用户({value.length})</ListGroup.Item>
                <ListGroup.Item>管理员({admins.length})</ListGroup.Item>
                <ListGroup.Item>裁判({judges.length})</ListGroup.Item>
              </ListGroup>
              <Col className="d-flex flex-column">
                <Button
                  variant="success"
                  className="my-3"
                  onClick={this.handleShow}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  增加
                </Button>
                <Button variant="danger" type="submit" id="delete">
                  <FontAwesomeIcon icon={faTrash} />
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
          onHide={this.handleClose}
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          list={this.state.list}
          onClose={this.handleClose}
        />
      </ActivityManageFrame>
    );
  }
}

export default AdministratorPage;
