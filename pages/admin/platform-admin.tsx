import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { FormEvent, PureComponent } from 'react';
import { Button, Form } from 'react-bootstrap';

import { PlatformAdminFrame } from '../../components/PlatformAdmin/PlatformAdminFrame';
import { PlatformAdminModal } from '../../components/PlatformAdmin/PlatformAdminModal';
import { HackathonAdminList } from '../../components/User/HackathonAdminList';
import { PlatformAdminModel } from '../../models/PlatformAdmin';
import { i18n } from '../../models/Translation';

const { t } = i18n;

export default function PlatformAdminPage() {
  return (
    <PlatformAdminFrame title={t('admin_management')} path="platform-admin">
      <PlatformAdmin />
    </PlatformAdminFrame>
  );
}

@observer
class PlatformAdmin extends PureComponent {
  store = new PlatformAdminModel();

  @observable
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
    const { store, show } = this;
    const loading = store.uploading > 0;

    return (
      <>
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
          <ScrollList
            translator={i18n}
            store={store}
            renderList={allItems => (
              <HackathonAdminList
                defaultData={allItems}
                selectedIds={this.selectedIds}
                onSelect={list => (this.selectedIds = list)}
              />
            )}
          />
        </Form>

        <PlatformAdminModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => (this.show = false) || this.store.refreshList()}
        />
      </>
    );
  }
}
