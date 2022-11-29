import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { t } from 'i18next';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormEvent, PureComponent } from 'react';
import { Button, Form } from 'react-bootstrap';

import { PlatformAdminFrame } from '../../components/PlatformAdmin/PlatformAdminFrame';
import { PlatformAdminList } from '../../components/PlatformAdmin/PlatformAdminList';
import { PlatformAdminModal } from '../../components/PlatformAdmin/PlatformAdminModal';
import { PlatformAdminModel } from '../../models/PlatformAdmin';

@observer
export default class PlatformAdminPage extends PureComponent<{}> {
  store = new PlatformAdminModel();

  selectedIds: string[] = [];

  @observable
  show = false;

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;

    if (!selectedIds[0]) return alert(t('please_select_at_least_one_user'));

    if (!confirm(t('confirm_to_delete_platform_admin'))) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  render() {
    const //{ resolvedUrl, params } = this.props.route,
      { store, show } = this;
    const loading = store.uploading > 0;

    return (
      <PlatformAdminFrame title={t('admin_management')} path="platform-admin">
        <Form onSubmit={this.handleSubmit}>
          <Button
            variant="success"
            className="my-3 me-2"
            disabled={loading}
            onClick={() => (this.show = true)}
          >
            <FontAwesomeIcon className="me-2" icon={faPlus} />
            {t('add')}
          </Button>
          <Button variant="danger" type="submit" disabled={loading}>
            <FontAwesomeIcon className="me-2" icon={faTrash} />
            {t('delete')}
          </Button>
          <PlatformAdminList
            store={store}
            onSelect={list => (this.selectedIds = list)}
          />
        </Form>

        <PlatformAdminModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => (this.show = false) || this.store.refreshList()}
        />
      </PlatformAdminFrame>
    );
  }
}
