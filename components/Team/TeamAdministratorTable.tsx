import { observer } from 'mobx-react';
import { FC } from 'react';
import { Form, Table } from 'react-bootstrap';

import { TeamMember } from '../../models/Activity/Team';
import { i18n } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';
import styles from '../../styles/Table.module.less';
import { XScrollListProps } from '../layout/ScrollList';

const { t } = i18n;

export interface TeamAdministratorTableLayoutProps
  extends XScrollListProps<TeamMember> {
  onUpdateRole?: (userId: number, role: 'admin' | 'member') => any;
  onPopUpUpdateRoleModal?: (userId: number) => any;
}

const TableHeads = () => [
  '#',
  t('mail'),
  t('phone_number'),
  // t('contact_address'),
  // t('last_login_time'),
  t('remark'),
  t('role_type'),
];

const RoleName = () => ({
  member: t('member'),
  admin: t('admin'),
});

export const TeamAdministratorTableLayout: FC<TeamAdministratorTableLayoutProps> =
  observer(({ defaultData = [], onUpdateRole }) => {
    const { id: currentUserId } = sessionStore?.user || {};

    return (
      <Table hover responsive="lg" className={styles.table}>
        <thead>
          <tr>
            {TableHeads().map((data, idx) => (
              <th key={idx + data}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {defaultData.map(
            (
              { userId, user: { email, mobilePhone, name }, role, description },
              index,
            ) => (
              <tr key={userId}>
                {[
                  index + 1,
                  name || email || mobilePhone || '--',
                  email || '--',
                  mobilePhone || '--',
                  // address || '--',
                  // convertDatetime(lastLogin),
                  description,
                  userId,
                ].map((data, idx, { length }) =>
                  idx + 1 === length ? (
                    <td key={idx + userId}>
                      <Form.Control
                        as="select"
                        className={styles.form}
                        disabled={currentUserId === userId}
                        onChange={({ currentTarget: { value } }) =>
                          onUpdateRole?.(userId, value as TeamMember['role'])
                        }
                        defaultValue={role}
                      >
                        {Object.entries(RoleName()).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </Form.Control>
                    </td>
                  ) : (
                    <td key={idx + userId} title={data + ''}>
                      {data}
                    </td>
                  ),
                )}
              </tr>
            ),
          )}
        </tbody>
      </Table>
    );
  });
