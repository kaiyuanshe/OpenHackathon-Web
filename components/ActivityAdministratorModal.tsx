import { t } from 'i18next';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { createRef, FormEvent, PureComponent } from 'react';
import { Button, Col, Form, Modal, ModalProps, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { Staff, StaffModel } from '../models/Staff';
import { UserList } from './User/UserList';

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

    if (!userId) return alert(t('search_an_user'));

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
    const { show, onHide, store } = this.props;
    const loading = store.uploading > 0;

    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('add_manager')}</Modal.Title>
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
                  label={t('admin')}
                  id="staff-admin"
                  name="type"
                  type="radio"
                  value="admin"
                  required
                />
              </Col>
              <Col>
                <Form.Check
                  label={t('referee')}
                  id="staff-judge"
                  name="type"
                  type="radio"
                  value="judge"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="description">
              <Col sm={8}>
                <Form.Control name="description" placeholder={t('remark')} />
              </Col>
              <Form.Label column sm={4} />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" type="reset" disabled={loading}>
                {t('cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {t('save')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
