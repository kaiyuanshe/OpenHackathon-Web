import { FormEvent, PureComponent } from 'react';
import { Row, Col, Table, Form, ListGroup, Button } from 'react-bootstrap';
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
import { AdministratorModal } from '../../../../components/ActivityAdministratorModal';
import styles from '../../../../styles/Table.module.less';
interface State {
  show: boolean;
  checked: boolean;
  inputVal: string;
  nextLink?: string | null;
  list: User[];
}

interface AdministratorPageProps {
  activity: string;
  path: string;
  admins: ListData<AdminsJudges>;
  judges: ListData<AdminsJudges>;
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

export async function getServerSideProps({
  params: { name } = {},
  req,
}: GetServerSidePropsContext<{ name?: string }>) {
  if (!name)
    return {
      notFound: true,
      props: {} as AdministratorPageProps,
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
    checked: false,
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
    if (!userId) return;
    //此处进行判断，如果adminjudge不为空，传入事件为增加管理员/裁判；否则删除管理员或裁判
    if (adminJudge) {
      await requestClient(
        `hackathon/${activity}/${adminJudge}/${userId}`,
        'PUT',
        description,
      );
    } else {
      if (typeof userId != 'string') return;
      //此处userId稍有不同，后台数据无法区分管理员与裁判，所以此处userId前面接了一段adminh或judge
      const [user, id] = userId.split(':');
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
    const { inputVal } = this.state,
      { value } = await requestClient<ListData<User>>(
        `user/search?keyword=${inputVal}`,
        'POST',
      );
    if (!value) return;
    this.setState({
      list: [...value],
    });

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
  handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      inputVal: value,
    });
  };

  toggleSelectAll = ({
    currentTarget: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    checked
      ? this.setState({
          checked: true,
        })
      : this.setState({
          checked: false,
        });
  };

  renderField = ({
    createdAt,
    updatedAt,
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
      {[
        userId,
        nickname,
        email,
        description ? '裁判' : '管理员',
        createdAt < updatedAt ? '已通过' : '审核中',
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
              value={description ? `judge:${data}` : `admin:${data}`}
              checked={this.state.checked}
            />
          </td>
        ),
      )}
    </tr>
  );

  render() {
    const { activity, path, admins, judges } = this.props,
      value = [...admins.value, ...judges.value],
      len = [value.length, admins.value.length, judges.value.length];

    return (
      <ActivityManageFrame path={path}>
        <PageHead title={`${activity}活动管理 管理员`} />
        <Form onSubmit={this.handleSubmit}>
          <Row xs="1" sm="2">
            <Col sm="auto" md="auto">
              <ListGroup>
                <ListGroup.Item>全部用户({len[0]})</ListGroup.Item>
                <ListGroup.Item>管理员({len[1]})</ListGroup.Item>
                <ListGroup.Item>裁判({len[2]})</ListGroup.Item>
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
                          #
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
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          handleSearch={this.handleSearch}
          list={this.state.list}
          handleClose={this.handleClose}
        />
      </ActivityManageFrame>
    );
  }
}

export default AdministratorPage;
