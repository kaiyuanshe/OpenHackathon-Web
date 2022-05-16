import { FormEvent, PureComponent, SyntheticEvent } from 'react';
import { Modal, Form, Table, Row, Col, Button } from 'react-bootstrap';
import { formToJSON } from 'web-utility';
import { ListData } from '../models/Base';

import { User } from '../models/User';
import { requestClient } from '../pages/api/core';

interface State {
  list: User[];
}

export interface AdministratorModalProps {
  show: boolean;
  activity: string;
  onHide?: () => any;
  updateList: () => Promise<any>;
}

export class AdministratorModal extends PureComponent<
  AdministratorModalProps,
  State
> {
  state: Readonly<State> = {
    list: [],
  };

  searchId = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { userSearch } = formToJSON<{
        userSearch: string;
      }>(event.currentTarget),
      { value: searchResult } = await requestClient<ListData<User>>(
        `user/search?keyword=${userSearch}`,
        'POST',
      );
    if (!searchResult?.[0]) return alert('您要查询的用户不存在');
    const form = event.target as HTMLFormElement;
    form.reset();
    this.setState({
      list: [...searchResult],
    });
  };

  increaseId = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    const { userId, adminJudge, description } = formToJSON<{
        userId: string | string[];
        adminJudge: string;
        description: string;
      }>(event.currentTarget),
      { activity } = this.props;

    if (!userId) return alert('请先搜索并选择一位用户');

    await requestClient(
      `hackathon/${activity}/${adminJudge}/${userId}`,
      'PUT',
      { description },
    );
    self.alert('已知悉您的请求，正在处理中！');
    this.props.updateList();
    const form = event.target as HTMLFormElement;
    form.reset();
    this.setState({ list: [] });
  };

  handleReset = (event: FormEvent) => {
    this.setState({
      list: [],
    });
  };

  render() {
    const { list } = this.state;
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>增加管理员</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.searchId}>
            <Form.Group as={Row}>
              <Col>
                <Form.Control
                  id="userSearch"
                  name="userSearch"
                  aria-label="search user"
                  type="search"
                  placeholder="用户名 / 昵称 / 邮箱"
                  required
                />
              </Col>
              <Col xs sm={4}>
                <Button variant="info" type="submit" id="search">
                  搜索
                </Button>
              </Col>
            </Form.Group>
          </Form>
          <Form onSubmit={this.increaseId} onReset={this.handleReset}>
            <Table className="my-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>用户名</th>
                  <th>昵称</th>
                  <th>邮箱</th>
                </tr>
              </thead>
              <tbody>
                {list?.map(({ username, nickname, email, id }, idx) => (
                  <tr key={id}>
                    <td>
                      <Form.Check
                        inline
                        aria-label={id}
                        value={id}
                        name="userId"
                        type="radio"
                        required
                      />
                    </td>
                    <td>{username}</td>
                    <td>{nickname}</td>
                    <td>{email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Form.Group as={Row} className="mt-3 py-3 ps-2">
              <Col>
                <Form.Check
                  id="admin"
                  label="管理员"
                  name="adminJudge"
                  type="radio"
                  value="admin"
                  required
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
              <Form.Label column sm={4} htmlFor="description" />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" type="reset">
                取消
              </Button>
              <Button variant="primary" type="submit" id="increase">
                保存
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
