import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Button, Form, Table } from 'react-bootstrap';

import activityStore from '../models/Activity';
import { Enrollment, statusName } from '../models/Enrollment';
import styles from '../styles/participant.module.less';
import { XScrollList, XScrollListProps } from './ScrollList';

export interface EnrollmentListProps extends XScrollListProps<Enrollment> {
  activity: string;
  onPopUp?: (extensions: Enrollment['extensions']) => any;
  onVerify?: (userId: string, status: Enrollment['status']) => any;
}

export const EnrollmentListLayout = ({
  defaultData = [],
  onPopUp,
  onVerify,
}: Pick<EnrollmentListProps, 'defaultData' | 'onPopUp' | 'onVerify'>) => (
  <Table className={styles['container-table']}>
    <thead>
      <tr>
        <th>#</th>
        <th>{t('user_name')}</th>
        <th>{t('mail')}</th>
        <th>{t('login_way')}</th>
        <th>{t('phone_number')}</th>
        <th>{t('contact_address')}</th>
        <th>{t('enrollment')}</th>
        <th>{t('status')}</th>
      </tr>
    </thead>
    <tbody>
      {defaultData.map(({ user, status, extensions, createdAt }, index) => (
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
              {Object.entries(statusName).map(([key, value]) => (
                <option key={key} value={key} selected={key === status}>
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

@observer
export class EnrollmentList extends XScrollList<EnrollmentListProps> {
  store = activityStore.enrollmentOf(this.props.activity);

  constructor(props: EnrollmentListProps) {
    super(props);

    this.boot();
  }

  onVerify: EnrollmentListProps['onVerify'] = async (userId, status) => {
    await this.store.verifyOne(userId, status);

    this.props.onVerify?.(userId, status);
  };

  renderList() {
    return (
      <EnrollmentListLayout
        defaultData={this.store.allItems}
        onPopUp={this.props.onPopUp}
        onVerify={this.onVerify}
      />
    );
  }
}
