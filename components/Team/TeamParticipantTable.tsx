import { FC } from 'react';
import { Form, Table } from 'react-bootstrap';

import { MembershipStatus, TeamMember } from '../../models/Activity/Team';
import { i18n } from '../../models/Base/Translation';
import styles from '../../styles/Table.module.less';
import { convertDatetime } from '../../utils/time';
import { XScrollListProps } from '../layout/ScrollList';

const { t } = i18n;

export interface TeamParticipantTableLayoutProps
  extends XScrollListProps<TeamMember> {
  onApprove?: (userId: number, status: MembershipStatus) => any;
}

const StatusName: () => Record<TeamMember['status'], string> = () => ({
  approved: t('status_approved'),
  pendingApproval: t('status_pending'),
});

const TableHeads = () => [
  '#',
  t('mail'),
  t('phone_number'),
  // t('contact_address'),
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
            user: { id, email, mobilePhone, name },
          },
          index,
        ) => (
          <tr key={id}>
            {[
              index + 1,
              name || email || mobilePhone || '--',
              email || '--',
              mobilePhone || '--',
              // address || '--',
              convertDatetime(createdAt),
              role === 'admin' ? t('admin') : t('member'),
              description,
              status,
            ].map((data, idx, { length }) =>
              idx + 1 === length ? (
                <td key={id}>
                  <Form.Control
                    as="select"
                    className={styles.form}
                    disabled={status === MembershipStatus.APPROVED}
                    onChange={({ currentTarget: { value } }) =>
                      onApprove?.(id, value as MembershipStatus)
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
                <td key={id} title={data + ''}>
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
