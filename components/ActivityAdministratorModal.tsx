import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent, FormEvent, createRef } from 'react';
import { Row, Col, Form, Button, ModalProps, Modal } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { UserList } from './User/UserList';
import { Staff, StaffModel } from '../models/ActivityManage';

export interface AdministratorModalProps
  extends Pick<ModalProps, 'show' | 'onHide'> {
  store: StaffModel;
  onSave?: () => any;
}

@observer
export class AdministratorModal extends PureComponent<AdministratorModalProps> {
  private userList = createRef<UserList>();
  private form = createRef<HTMLFormElement>();

  @observable
  userId = '';

  increaseId = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { currentTarget } = event,
      { store, onSave } = this.props,
      { userId } = this;
    const { type, description } =
      formToJSON<Pick<Staff, 'type' | 'description'>>(currentTarget);

    if (!userId) return alert('请先搜索并选择一位用户');

    await store.updateOne({ type, description }, userId);
    onSave?.();
    this.handleReset();
  };

  handleReset = () => {
    this.form.current?.reset();
    this.userList.current?.store.clear();
    this.props.onHide?.();
  };

  render() {
    const { show, onHide } = this.props;

    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>增加管理员</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserList
            ref={this.userList}
            onSelect={([userId]) => (this.userId = userId)}
          />
          <Form
            ref={this.form}
            onSubmit={this.increaseId}
            onReset={this.handleReset}
          >
            <Form.Group as={Row} className="mt-3 py-3 ps-2">
              <Col>
                <Form.Check
                  label="管理员"
                  id="staff-admin"
                  name="type"
                  type="radio"
                  value="admin"
                  required
                />
              </Col>
              <Col>
                <Form.Check
                  label="裁判"
                  id="staff-judge"
                  name="type"
                  type="radio"
                  value="judge"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Col sm={8}>
                <Form.Control name="description" placeholder="备注" />
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
