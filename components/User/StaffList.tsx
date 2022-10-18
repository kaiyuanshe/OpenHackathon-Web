import 'array-unique-proposal';

import { observer } from 'mobx-react';
import { Form, Table } from 'react-bootstrap';

import { Staff, StaffModel } from '../../models/Staff';
import styles from '../../styles/Table.module.less';
import { convertDatetime } from '../../utils/time';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface StaffListProps extends ScrollListProps<Staff> {
  store: StaffModel;
}

const TableHeads = [
  '所有',
  '名称',
  '邮箱',
  '角色类型',
  '状态',
  '帐户来源',
  '最后登录时间',
  '创建时间',
  '备注',
];

@observer
export class StaffList extends ScrollList<StaffListProps> {
  store = this.props.store;

  static Layout = ({
    value = [],
    selectedIds = [],
    onSelect,
  }: StaffListProps) => (
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
                  checked={selectedIds.length === value.length}
                  // https://github.com/facebook/react/issues/1798
                  ref={(input: HTMLInputElement | null) =>
                    input &&
                    (input.indeterminate =
                      !!selectedIds.length && selectedIds.length < value.length)
                  }
                  onClick={() =>
                    onSelect?.(
                      selectedIds.length === value.length
                        ? []
                        : value.map(({ userId }) => userId),
                    )
                  }
                />
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {value.map(
          ({
            createdAt,
            userId,
            user: {
              email,
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
                description ? '裁判' : '管理员',
                createdAt ? '已通过' : '审核中',
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
                      onClick={
                        onSelect &&
                        (({ currentTarget: { checked } }) => {
                          if (checked)
                            return onSelect(
                              [...selectedIds, userId].uniqueBy(),
                            );
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
}
