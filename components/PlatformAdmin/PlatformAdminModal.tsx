import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, FormEvent } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';

import { t } from '../../models/Base/Translation';
import userStore from '../../models/User';
import { PlatformAdminModel } from '../../models/User/PlatformAdmin';
import { UserList } from '../User/UserList';

export interface PlatformAdminModalProps
  extends Pick<ModalProps, 'show' | 'onHide'> {
  store: PlatformAdminModel;
  onSave?: () => any;
}

@observer
export class PlatformAdminModal extends Component<PlatformAdminModalProps> {
  @observable
  accessor userId = 0;

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
    userStore.clear();
    this.props.onHide?.();
  };

  render() {
    const { show, store } = this.props;
    const loading = store.uploading > 0;

    return (
      <Modal show={show} centered onHide={this.handleReset}>
        <Modal.Header closeButton>
          <Modal.Title>{t('add_manager')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserList
            store={userStore}
            onSelect={([userId]) => (this.userId = userId)}
          />
          <Form onSubmit={this.increaseId} onReset={this.handleReset}>
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
