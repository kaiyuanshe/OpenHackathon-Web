import 'array-unique-proposal';

import { FC } from 'react';
import { Form, Table } from 'react-bootstrap';

import { HackathonAdmin } from '../../models/Activity/Staff';
import { i18n } from '../../models/Base/Translation';
import styles from '../../styles/Table.module.less';
import { convertDatetime } from '../../utils/time';
import { XScrollListProps } from '../layout/ScrollList';

const { t } = i18n;

const TableHeads = [
  t('all'),
  t('name'),
  t('mail'),
  t('phone_number'),
  t('role_type'),
  t('status'),
  t('role_source'),
  t('last_login_time'),
  t('create_time'),
  t('remark'),
];

export const HackathonAdminList: FC<XScrollListProps<HackathonAdmin>> = ({
  defaultData = [],
  selectedIds = [],
  onSelect,
}) => (
  <Table hover responsive="lg" className={styles.table}>
    <thead>
      <tr>
        {TableHeads.map((data, idx) =>
          idx ? (
            <th key={idx + data}>{data}</th>
          ) : (
            <th key={idx + data}>
              <Form.Check
                inline
                type="checkbox"
                name="selectAll"
                aria-label="selectAll"
                checked={selectedIds.length === defaultData.length}
                // https://github.com/facebook/react/issues/1798
                ref={(input: HTMLInputElement | null) => {
                  if (input)
                    input.indeterminate =
                      !!selectedIds.length &&
                      selectedIds.length < defaultData.length;
                }}
                onChange={() =>
                  onSelect?.(
                    selectedIds.length === defaultData.length
                      ? []
                      : defaultData.map(({ userId }) => userId),
                  )
                }
              />
            </th>
          ),
        )}
      </tr>
    </thead>
    <tbody>
      {defaultData.map(
        ({
          createdAt,
          userId,
          user: {
            email,
            phone,
            nickname,
            lastLogin,
            registerSource: [source],
          },
          description,
        }) => (
          <tr key={userId}>
            {[
              userId,
              nickname,
              email,
              phone,
              description ? t('referee') : t('admin'),
              createdAt ? t('approve') : t('status_pending'),
              source.split(':')[1],
              convertDatetime(lastLogin),
              convertDatetime(createdAt),
              description,
            ].map((data, idx) =>
              idx ? (
                <td key={idx + userId + createdAt}>{data}</td>
              ) : (
                <td key={idx + userId + createdAt}>
                  <Form.Check
                    inline
                    type="checkbox"
                    name="userId"
                    value={data}
                    aria-label={description ? `judge${data}` : `admin${data}`}
                    checked={selectedIds.includes(userId)}
                    onChange={
                      onSelect &&
                      (({ currentTarget: { checked } }) => {
                        if (checked)
                          return onSelect([...selectedIds, userId].uniqueBy());

                        const index = selectedIds.indexOf(userId);

                        onSelect([
                          ...selectedIds.slice(0, index),
                          ...selectedIds.slice(index + 1),
                        ]);
                      })
                    }
                  />
                </td>
              ),
            )}
          </tr>
        ),
      )}
    </tbody>
  </Table>
);
