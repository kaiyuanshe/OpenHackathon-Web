import 'array-unique-proposal';
import { observer } from 'mobx-react';
import { Table, Form } from 'react-bootstrap';

import { ScrollListProps, ScrollList } from '../ScrollList';
import styles from '../../styles/Table.module.less';
import {
  MembershipStatus,
  TeamMember,
  TeamMemberFilter,
  TeamMemberModel,
} from '../../models/Team';
import sessionStore from '../../models/Session';
import { convertDatetime } from '../../utils/time';

export interface TeamAdministratorTableProps
  extends ScrollListProps<TeamMember> {
  store: TeamMemberModel;
  onUpdateRole?: (userId: string, role: 'admin' | 'member') => any;
  onPopUpUpdateRoleModal?: (userId: string) => any;
}

const TableHeads = [
  '#',
  '昵称',
  '邮箱',
  '联系电话',
  '联系地址',
  '最后登录时间',
  '备注',
  '角色类型',
];

const RoleName = {
  member: '成员',
  admin: '管理员',
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
                      >
                        {Object.entries(RoleName).map(([key, value]) => (
                          <option key={key} value={key} selected={key === role}>
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
