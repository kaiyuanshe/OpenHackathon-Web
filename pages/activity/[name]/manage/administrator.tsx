import { FormEvent, PureComponent } from 'react';
import {
  Row,
  Col,
  Table,
  Form,
  Modal,
  ListGroup,
  Button,
} from 'react-bootstrap';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formToJSON } from 'web-utility';
import { ActivityManageFrame } from '../../../../components/ActivityManageFrame';
import PageHead from '../../../../components/PageHead';
import { requestClient } from '../../../api/core';
import { AdminsJudges } from '../../../../models/ActivityManage';
import { User } from '../../../../models/User';
import { ListData } from '../../../../models/Base';
import { convertDatetime } from '../../../../components/time';

interface State {
  show: boolean;
  inputVal: string;
  nextLink?: string | null;
  list: User[];
}

export async function getServerSideProps({
  params: { name } = {},
  req,
}: GetServerSidePropsContext<{ name?: string }>) {
  if (!name)
    return {
      notFound: true,
      props: {} as {
        activity: string;
        path: string;
        admins: ListData<AdminsJudges>;
        judges: ListData<AdminsJudges>;
      },
    };
  const admins = await requestClient<ListData<AdminsJudges>>(
      `hackathon/${name}/admins`,
    ),
    judges = await requestClient<ListData<AdminsJudges>>(
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
    inputVal: '',
    list: [],
  };
  //处理两处表单提交，一处是增加管理员/裁判，一处是删除管理员/裁判
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    //解构赋值获得关键的userId和admin/judge参数
    const data = formToJSON(event.target as HTMLFormElement),
      { userId, adminJudge, description } = data,
      { activity } = this.props;
    if (userId!) return;
    //此处进行判断，如果adminjudge为空，传入事件为增加管理员/裁判；否则删除管理员或裁判
    if (adminJudge) {
      await requestClient(
        `hackathon/${activity}/${adminJudge}/${userId}`,
        'PUT',
        description,
      );
    } else {
      if (typeof userId != 'string') return;
      //此处userId稍有不同，后台数据无法区分管理员与裁判，所以此处userId前面接了一段adminh或judge
      const id: string = userId.slice().split(':')[1],
        user = userId.slice().split(':')[0];
      await requestClient(`hackathon/${activity}/${user}/${id}`, 'DELETE');
    }

    self.alert('已知悉您的请求，正在处理中！');
    this.setState({
      show: false,
      inputVal: '',
      list: [],
    });
    //明天需要测试一下url为同一地址时是否可以刷新网页
    location.href = `/activity/${activity}/manage/administrator`;
  };

  handleSearch = async () => {
    const { inputVal, list } = this.state,
      { value } = await requestClient<ListData<User>>(
        'user/search',
        'POST',
        inputVal,
      );
    console.log(value);
    this.setState({
      list: [...list, ...value],
    });

    if (value) return;
    alert('您要查询的用户不存在');
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
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      inputVal: event.target.value,
    });
  };

  toggleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    //全选无效果，可能是设置any的原因？
    const adminOrJudge: any = document.getElementsByClassName('adminOrJudge');

    if (adminOrJudge!) return;
    if (event.target.checked) {
      for (let i = 0; adminOrJudge[i]; i++) {
        adminOrJudge[i].checked = true;
      }
    } else {
      for (let i = 0; adminOrJudge[i]; i++) {
        adminOrJudge[i].checked = false;
      }
    }
  };

  renderField = ({
    createdAt,
    userId,
    user: {
      email,
      nickname,
      lastLogin,
      registerSource: [source],
    },
    description,
  }: AdminsJudges) => (
    <tr>
      {description
        ? [
            userId,
            nickname,
            email,
            '裁判员',
            '审核中',
            source.split(':')[1],
            convertDatetime(lastLogin),
            convertDatetime(createdAt),
            description,
          ].map((data, idx) =>
            idx ? (
              <td key={idx + data}>{data}</td>
            ) : (
              <td key={idx + data}>
                <Form.Check
                  inline
                  aria-label={`judge${data}`}
                  id="judgeUser"
                  name="userId"
                  value={`judge:${data}`}
                />
              </td>
            ),
          )
        : [
            userId,
            nickname,
            email,
            '管理员',
            '审核中',
            source.split(':')[1],
            convertDatetime(lastLogin),
            convertDatetime(createdAt),
            '',
          ].map((data, idx) =>
            idx ? (
              <td key={idx + data}>{data}</td>
            ) : (
              <td key={idx + data}>
                <Form.Check
                  inline
                  className="adminOrJudge"
                  id="adminUser"
                  name="UserId"
                  value={`admin:${data}`}
                />
              </td>
            ),
          )}
    </tr>
  );

  render() {
    const { activity, path, admins, judges } = this.props,
      tableHead = [
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
    {
      console.log(admins);
    }
    return (
      <>
        <ActivityManageFrame path={path}>
          <PageHead title={`${activity}活动管理 管理员`} />
          <Form onSubmit={this.handleSubmit}>
            <Row xs="1" sm="2">
              <Col sm="auto" md="auto">
                <ListGroup>
                  <ListGroup.Item>
                    全部用户({admins.value.length + judges.value.length})
                  </ListGroup.Item>
                  <ListGroup.Item>管理员({admins.value.length})</ListGroup.Item>
                  <ListGroup.Item>裁判({judges.value.length})</ListGroup.Item>
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
                  <Button variant="danger" type="submit">
                    <FontAwesomeIcon icon={faTrash} />
                    删除
                  </Button>
                </Col>
              </Col>
              <Col className="flex-fill">
                <Table hover responsive="sm">
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
                  <tbody>
                    {admins && admins.value.map(this.renderField)}
                    {judges && judges.value.map(this.renderField)}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Form>
          {/*   渲染弹出框  */}
          <Modal show={this.state.show} onHide={this.handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>增加管理员</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group as={Row}>
                  <Col>
                    <Form.Control
                      id="userSearch"
                      name="userSearch"
                      aria-label="search user"
                      type="text"
                      placeholder="用户名 / 昵称 / 邮箱"
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col xs sm={4}>
                    <Button variant="info" onClick={this.handleSearch}>
                      搜索
                    </Button>
                  </Col>
                </Form.Group>
                <Table className="my-3">
                  <tr>
                    <th>用户名</th>
                    <th>昵称</th>
                    <th>邮箱</th>
                  </tr>
                  {this.state.list &&
                    this.state.list.map(
                      (
                        { name, nickname, email, identities: [{ userId }] },
                        idx,
                      ) => (
                        <tr key={idx}>
                          {idx! && (
                            <Form.Check
                              inline
                              aria-label={userId}
                              value={userId}
                              name="userId"
                              type="radio"
                            />
                          )}
                          <td>{name}</td>
                          <td>{nickname}</td>
                          <td>{email}</td>
                        </tr>
                      ),
                    )}
                </Table>
                <div>
                  <Form.Group as={Row} className="mt-3 py-3">
                    <Col>
                      <Form.Check
                        id="admin"
                        label="管理员"
                        name="adminJudge"
                        type="radio"
                        value="admin"
                        checked
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        id="judge"
                        label="裁判"
                        name="adminJudge"
                        type="radio"
                        value="judge"
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Col sm={8}>
                      <Form.Control
                        id="description"
                        name="description"
                        type="text"
                        placeholder="备注"
                      />
                    </Col>
                    <Form.Label
                      column
                      sm={4}
                      htmlFor="description"
                    ></Form.Label>
                  </Form.Group>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      取消
                    </Button>
                    <Button variant="primary" type="submit">
                      保存
                    </Button>
                  </Modal.Footer>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </ActivityManageFrame>
      </>
    );
  }
}

export default AdministratorPage;
