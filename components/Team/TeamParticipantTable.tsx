import { TeamMember, TeamMemberStatus } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Form, Table } from 'react-bootstrap';

import { i18n, I18nContext } from '../../models/Base/Translation';
import styles from '../../styles/Table.module.less';
import { convertDatetime } from '../../utils/time';
import { XScrollListProps } from '../layout/ScrollList';

export interface TeamParticipantTableLayoutProps extends XScrollListProps<TeamMember> {
  onApprove?: (userId: number, status: TeamMemberStatus) => any;
}

const StatusName = ({ t }: typeof i18n): Record<TeamMemberStatus, string> => ({
  approved: t('status_approved'),
  pendingApproval: t('status_pending'),
});

const TableHeads = ({ t }: typeof i18n) => [
  '#',
  t('mail'),
  t('phone_number'),
  // t('contact_address'),
  t('apply_time'),
  t('apply_role'),
  t('remark'),
  t('status'),
];

export const TeamParticipantTableLayout: FC<TeamParticipantTableLayoutProps> = observer(
  ({ defaultData = [], onApprove }) => {
    const i18n = useContext(I18nContext);
    const { t } = i18n;

    return (
      <Table hover responsive="lg" className={styles.table}>
        <thead>
          <tr>
            {TableHeads(i18n).map((data, idx) => (
              <th key={idx + data}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {defaultData.map(
            (
              { createdAt, description, role, status, user: { id, email, mobilePhone, name } },
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
                        disabled={status === 'approved'}
                        defaultValue={status}
                        onChange={({ currentTarget: { value } }) =>
                          onApprove?.(id, value as TeamMemberStatus)
                        }
                      >
                        {Object.entries(StatusName(i18n)).map(([key, value]) => (
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
  },
);
