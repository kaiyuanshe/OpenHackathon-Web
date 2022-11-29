import { t } from 'i18next';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { createRef, FormEvent, PureComponent } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';

import { PlatformAdminModel } from '../../models/PlatformAdmin';
import { UserList } from '../User/UserList';

export interface PlatformAdminModalProps
  extends Pick<ModalProps, 'show' | 'onHide'> {
  store: PlatformAdminModel;
  onSave?: () => any;
}

@observer
export class PlatformAdminModal extends PureComponent<PlatformAdminModalProps> {
  private userList = createRef<UserList>();
  private form = createRef<HTMLFormElement>();

  @observable
  userId = '';

  increaseId = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store, onSave } = this.props,
      { userId } = this;

    if (!userId) return alert(t('search_an_user'));

    await store.addOnePlatformAdmin(userId);
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
