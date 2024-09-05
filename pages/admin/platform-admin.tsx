import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { Component, FC, FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';

import { PlatformAdminFrame } from '../../components/PlatformAdmin/PlatformAdminFrame';
import { PlatformAdminModal } from '../../components/PlatformAdmin/PlatformAdminModal';
import { HackathonAdminList } from '../../components/User/HackathonAdminList';
import { i18n } from '../../models/Base/Translation';
import { PlatformAdminModel } from '../../models/User/PlatformAdmin';
import { sessionGuard } from '../api/core';

const { t } = i18n;

export const getServerSideProps = sessionGuard;

const PlatformAdminPage: FC = observer(() => (
  <PlatformAdminFrame title={t('admin_management')} path="platform-admin">
    <PlatformAdminView />
  </PlatformAdminFrame>
));

export default PlatformAdminPage;

@observer
class PlatformAdminView extends Component {
  store = new PlatformAdminModel();

  @observable
  accessor selectedIds: number[] = [];

  @observable
  accessor show = false;

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
        <PlatformAdminModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => (this.show = false) || this.store.refreshList()}
        />
      </Form>
    );
  }
}
