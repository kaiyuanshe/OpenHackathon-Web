import 'array-unique-proposal';

import { observer } from 'mobx-react';
import { Form, Table } from 'react-bootstrap';

import {
  MembershipStatus,
  TeamMember,
  TeamMemberModel,
} from '../../models/Team';
import styles from '../../styles/Table.module.less';
import { convertDatetime } from '../../utils/time';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface TeamParticipantTableProps extends ScrollListProps<TeamMember> {
  store: TeamMemberModel;
  onApprove?: (userId: string, status: MembershipStatus) => any;
}

const StatusName: Record<TeamMember['status'], string> = {
  approved: '通过',
  pendingApproval: '审核中',
};

const TableHeads = [
  '#',
  '昵称',
  '邮箱',
  '联系电话',
  '联系地址',
  '申请时间',
  '申请角色',
  '备注',
  '状态',
];

@observer
export class TeamParticipantTable extends ScrollList<TeamParticipantTableProps> {
  store = this.props.store;

  extraProps: Partial<TeamParticipantTableProps> = {
    onApprove: (userId, status) => this.store.approveOne(userId, status),
  };

  static Layout = ({ value = [], onApprove }: TeamParticipantTableProps) => (
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
              createdAt,
              description,
              role,
              status,
              user: { address, email, nickname, phone, username },
              userId,
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
                convertDatetime(createdAt),
                role === 'admin' ? '管理员' : '成员',
                description,
                status,
              ].map((data, idx, { length }) =>
                idx + 1 === length ? (
                  <td key={idx + userId}>
                    <Form.Control
                      as="select"
                      className={styles.form}
                      disabled={status === MembershipStatus.APPROVED}
                      onChange={({ currentTarget: { value } }) =>
                        onApprove?.(userId, value as MembershipStatus)
                      }
                      defaultValue={status}
                    >
                      {Object.entries(StatusName).map(([key, value]) => (
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
}
