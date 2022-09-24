import { observer } from 'mobx-react';
import { Button, Form, Table } from 'react-bootstrap';

import { ScrollListProps, ScrollList } from './ScrollList';
import styles from '../styles/participant.module.less';
import activityStore from '../models/Activity';
import { Enrollment } from '../models/Enrollment';

export interface EnrollmentListProps extends ScrollListProps<Enrollment> {
  activity: string;
  onPopUp?: (extensions: Enrollment['extensions']) => any;
  onVerify?: (userId: string, status: Enrollment['status']) => any;
}

const StatusName: Record<Enrollment['status'], string> = {
  approved: '通过',
  rejected: '拒绝',
  none: '未审核',
  pendingApproval: '审核中',
};

@observer
export class EnrollmentList extends ScrollList<EnrollmentListProps> {
  store = activityStore.enrollmentOf(this.props.activity);

  extraProps: Partial<EnrollmentListProps> = {
    onVerify: async (userId, status) => {
      await this.store.verifyOne(userId, status);

      this.props.onVerify?.(userId, status);
    },
  };

  static Layout = ({ value = [], onPopUp, onVerify }: EnrollmentListProps) => (
    <Table className={styles['container-table']}>
      <thead>
        <tr>
          <th>#</th>
          <th>注册名</th>
          <th>邮箱</th>
          <th>登录方式</th>
          <th>联系电话</th>
          <th>联系地址</th>
          <th>报名时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        {value.map(({ user, status, extensions, createdAt }, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>
              <Button variant="link" onClick={() => onPopUp?.(extensions)}>
                {user.nickname || user.phone}
              </Button>
            </td>
            <td>{user.email}</td>
            <td>{user.registerSource[0].split(':')[1]}</td>
            <td>{user.phone}</td>
            <td>{user.address}</td>
            <td>{createdAt.split('T')[0]}</td>
            <td>
              <Form.Control
                as="select"
                className={styles.form}
                onChange={({ currentTarget: { value } }) =>
                  onVerify?.(user.id!, value as Enrollment['status'])
                }
              >
                {Object.entries(StatusName).map(([key, value]) => (
                  <option key={key} value={key} defaultChecked={key === status}>
                    {value}
                  </option>
                ))}
              </Form.Control>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
