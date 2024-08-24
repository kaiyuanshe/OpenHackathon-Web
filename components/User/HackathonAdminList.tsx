import 'array-unique-proposal';

import { PlatformAdmin, Staff } from '@kaiyuanshe/openhackathon-service';
import { FC } from 'react';
import { Form, Table } from 'react-bootstrap';

import { i18n } from '../../models/Base/Translation';
import styles from '../../styles/Table.module.less';
import { convertDatetime } from '../../utils/time';
import { XScrollListProps } from '../layout/ScrollList';

const { t } = i18n;

const TableHeads = () => [
  t('all'),
  t('name'),
  t('mail'),
  t('phone_number'),
  t('role_type'),
  t('status'),
  // t('last_login_time'),
  t('create_time'),
  t('remark'),
];

export const HackathonAdminList: FC<
  XScrollListProps<Staff | PlatformAdmin>
> = ({ defaultData = [], selectedIds = [], onSelect }) => (
  <Table hover responsive="lg" className={styles.table}>
    <thead>
      <tr>
        {TableHeads().map((data, idx) =>
          idx ? (
            <th key={data}>{data}</th>
          ) : (
            <th key={data}>
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
                      : defaultData.map(({ user: { id } }) => id),
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
          user: {
            id,
            email,
            mobilePhone,
            name,
            // lastLogin,
          },
          description,
        }) => (
          <tr key={id}>
            {[
              id,
              name,
              email,
              mobilePhone,
              description ? t('referee') : t('admin'),
              createdAt ? t('approve') : t('status_pending'),
              // convertDatetime(lastLogin),
              convertDatetime(createdAt),
              description,
            ].map((data, idx) =>
              idx ? (
                <td key={id + createdAt}>{data}</td>
              ) : (
                <td key={id + createdAt}>
                  <Form.Check
                    inline
                    type="checkbox"
                    name="userId"
                    value={data}
                    aria-label={description ? `judge${data}` : `admin${data}`}
                    checked={selectedIds.includes(id)}
                    onChange={
                      onSelect &&
                      (({ currentTarget: { checked } }) => {
                        if (checked)
                          return onSelect([...selectedIds, id].uniqueBy());

                        const index = selectedIds.indexOf(id);

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
