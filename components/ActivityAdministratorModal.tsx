import { SyntheticEvent } from 'react';
import { Modal, Form, Table, Row, Col, Button } from 'react-bootstrap';

import { User } from '../models/User';

export interface AdministratorModalProps {
  show: boolean;
  list: User[];
  onSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => any;
  onReset: () => any;
  onHide?: () => any;
}

export const AdministratorModal = ({
  show,
  onHide,
  onSubmit,
  onReset,
  list,
}: AdministratorModalProps) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>增加管理员</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={onSubmit}>
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
      <Form onSubmit={onSubmit} onReset={onReset}>
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
