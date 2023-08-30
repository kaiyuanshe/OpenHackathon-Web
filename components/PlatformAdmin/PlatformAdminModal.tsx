import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormEvent, PureComponent } from 'react';
import { Button, Form, Modal, ModalProps } from 'react-bootstrap';

import { PlatformAdminModel } from '../../models/PlatformAdmin';
import { i18n } from '../../models/Translation';
import userStore from '../../models/User';
import { UserList } from '../User/UserList';

const { t } = i18n;

export interface PlatformAdminModalProps
  extends Pick<ModalProps, 'show' | 'onHide'> {
  store: PlatformAdminModel;
  onSave?: () => any;
}

@observer
export class PlatformAdminModal extends PureComponent<PlatformAdminModalProps> {
  constructor(props: PlatformAdminModalProps) {
    super(props);
    makeObservable(this);
  }

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
    userStore.clear();
    this.props.onHide?.();
  };

  render() {
    const { show, store } = this.props;
    const loading = store.uploading > 0;

    return (
      <Modal show={show} onHide={this.handleReset} centered>
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
