import { PlatformAdmin } from '@kaiyuanshe/openhackathon-service';
import { Column, RestForm, SearchableInput } from 'mobx-restful-table';

import { i18n } from '../../models/Base/Translation';
import userStore from '../../models/User';

export const adminColumns = <T extends PlatformAdmin>(translator: typeof i18n): Column<T>[] => [
  {
    key: 'user',
    renderHead: translator.t('user'),
    renderBody: ({ user: { name, email, mobilePhone } }) => (
      <div className="d-flex align-items-center gap-1">
        {name}
        <a href={`mailto:${email}`}>📧</a>
        <a href={`tel:${mobilePhone}`}>📱</a>
      </div>
    ),
    renderInput: ({ user }, { key, ...meta }) => (
      <RestForm.FieldBox name={key} {...meta}>
        <SearchableInput
          translator={translator}
          store={userStore}
          labelKey="email"
          valueKey="id"
          name={key as string}
          defaultValue={[{ value: user?.id.toString(), label: user?.email || '' }]}
        />
      </RestForm.FieldBox>
    ),
  },
  { key: 'description', renderHead: translator.t('description') },
];
