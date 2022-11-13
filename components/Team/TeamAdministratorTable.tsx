import 'array-unique-proposal';

import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Form, Table } from 'react-bootstrap';

import sessionStore from '../../models/Session';
import {
  MembershipStatus,
  TeamMember,
  TeamMemberFilter,
  TeamMemberModel,
} from '../../models/Team';
import styles from '../../styles/Table.module.less';
import { convertDatetime } from '../../utils/time';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface TeamAdministratorTableProps
  extends ScrollListProps<TeamMember> {
  store: TeamMemberModel;
  onUpdateRole?: (userId: string, role: 'admin' | 'member') => any;
  onPopUpUpdateRoleModal?: (userId: string) => any;
}

const TableHeads = [
  '#',
  t('nick_name'),
  t('mail'),
  t('phone_number'),
  t('contact_address'),
  t('last_login_time'),
  t('remark'),
  t('role_type'),
];

const RoleName = {
  member: t('member'),
  admin: t('admin'),
};

@observer
export class TeamAdministratorTable extends ScrollList<TeamAdministratorTableProps> {
  store = this.props.store;

  filter: TeamMemberFilter = {
    status: MembershipStatus.APPROVED,
  };

  extraProps: Partial<TeamAdministratorTableProps> = {
    onUpdateRole: (userId, role) => this.store.updateRole(userId, role),
  };

  static Layout = ({
    value = [],
    onUpdateRole,
  }: TeamAdministratorTableProps) => {
    const { id: currentUserId } = sessionStore?.user || {};

    return (
      <Table hover responsive="lg" className={styles.table}>
        <thead>
          <tr>
            {TableHeads.map((data, idx) => (
              <th key={idx + data}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map(
            (
              {
                userId,
                user: { address, email, lastLogin, nickname, phone, username },
                role,
                description,
              },
              index,
            ) => (
              <tr key={userId}>
                {[
                  index + 1,
                  nickname || username || email || phone || '--',
                  email || '--',
                  phone || '--',
                  address || '--',
                  convertDatetime(lastLogin),
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
                        {Object.entries(RoleName).map(([key, value]) => (
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
  };
}
