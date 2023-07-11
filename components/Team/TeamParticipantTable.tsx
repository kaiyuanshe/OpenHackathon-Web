import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { FC, PureComponent } from 'react';
import { Form, Table } from 'react-bootstrap';

import {
  MembershipStatus,
  TeamMember,
  TeamMemberModel,
} from '../../models/Team';
import { i18n } from '../../models/Translation';
import styles from '../../styles/Table.module.less';
import { convertDatetime } from '../../utils/time';
import { XScrollListProps } from '../layout/ScrollList';

const { t } = i18n;

export interface TeamParticipantTableLayoutProps
  extends XScrollListProps<TeamMember> {
  onApprove?: (userId: string, status: MembershipStatus) => any;
}

const StatusName: () => Record<TeamMember['status'], string> = () => ({
  approved: t('status_approved'),
  pendingApproval: t('status_pending'),
});

const TableHeads = () => [
  '#',
  t('nick_name'),
  t('mail'),
  t('phone_number'),
  t('contact_address'),
  t('apply_time'),
  t('apply_role'),
  t('remark'),
  t('status'),
];

export const TeamParticipantTableLayout: FC<
  TeamParticipantTableLayoutProps
> = ({ defaultData = [], onApprove }) => (
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
              role === 'admin' ? t('admin') : t('member'),
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
                    {Object.entries(StatusName()).map(([key, value]) => (
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

export interface TeamParticipantTableProps
  extends ScrollListProps<TeamMember>,
    TeamParticipantTableLayoutProps {
  store: TeamMemberModel;
}

export class TeamParticipantTable extends PureComponent<TeamParticipantTableProps> {
  onApprove: TeamParticipantTableProps['onApprove'] = (userId, status) =>
    this.props.store.approveOne(userId, status);

  render() {
    return (
      <ScrollList
        translator={i18n}
        store={this.props.store}
        renderList={allItems => (
          <TeamParticipantTableLayout
            defaultData={allItems}
            onApprove={this.onApprove}
          />
        )}
      />
    );
  }
}
