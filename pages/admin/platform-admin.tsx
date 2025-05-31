import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { RestTable } from 'mobx-restful-table';
import { FC, useContext } from 'react';

import { PlatformAdminFrame } from '../../components/PlatformAdmin/PlatformAdminFrame';
import { adminColumns } from '../../components/User/HackathonAdminList';
import { i18n, I18nContext } from '../../models/Base/Translation';
import { PlatformAdminModel } from '../../models/User/PlatformAdmin';
import { sessionGuard } from '../api/core';

export const getServerSideProps = sessionGuard;

const PlatformAdminPage: FC = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <PlatformAdminFrame title={t('admin_management')} path="platform-admin">
      <PlatformAdminView />
    </PlatformAdminFrame>
  );
});
export default PlatformAdminPage;

@observer
class PlatformAdminView extends ObservedComponent<{}, typeof i18n> {
  static contextType = I18nContext;

  store = new PlatformAdminModel();

  render() {
    const i18n = this.observedContext,
      { downloading, uploading } = this.store;

    const loading = downloading > 0 || uploading > 0;

    return (
      <>
        <RestTable
          translator={i18n}
          store={this.store}
          columns={adminColumns(i18n)}
          editable
          deletable
        />
        {loading && <Loading />}
      </>
    );
  }
}
