import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { FC, PureComponent } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { Enrollment, statusName } from '../../models/Enrollment';
import { i18n } from '../../models/Translation';
import styles from '../../styles/participant.module.less';
import { XScrollListProps } from '../layout/ScrollList';

const { t } = i18n;

export interface EnrollmentListLayoutProps
  extends XScrollListProps<Enrollment> {
  onPopUp?: (extensions: Enrollment['extensions']) => any;
  onVerify?: (userId: string, status: Enrollment['status']) => any;
}

export const EnrollmentListLayout: FC<EnrollmentListLayoutProps> = ({
  defaultData = [],
  onPopUp,
  onVerify,
}) => (
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
      {defaultData.map(
        (
          {
            user: {
              id,
              address,
              email,
              nickname,
              phone,
              username,
              registerSource,
            },
            status,
            extensions,
            createdAt,
          },
          index,
        ) => (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>
              <Button variant="link" onClick={() => onPopUp?.(extensions)}>
                {nickname || username || email || phone}
              </Button>
            </td>
            <td>{email}</td>
            <td>{registerSource[0].split(':')[1]}</td>
            <td>{phone}</td>
            <td>{address}</td>
            <td>{createdAt.split('T')[0]}</td>
            <td>
              <Form.Control
                as="select"
                className={styles.form}
                onChange={({ currentTarget: { value } }) =>
                  onVerify?.(id!, value as Enrollment['status'])
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
        ),
      )}
    </tbody>
  </Table>
);

export interface EnrollmentListProps extends EnrollmentListLayoutProps {
  activity: string;
}

export class EnrollmentList extends PureComponent<EnrollmentListProps> {
  store = activityStore.enrollmentOf(this.props.activity);

  onVerify: EnrollmentListLayoutProps['onVerify'] = async (userId, status) => {
    await this.store.verifyOne(userId, status);

    this.props.onVerify?.(userId, status);
  };

  render() {
    return (
      <ScrollList
        translator={i18n}
        store={this.store}
        renderList={allItems => (
          <EnrollmentListLayout
            defaultData={allItems}
            onPopUp={this.props.onPopUp}
            onVerify={this.onVerify}
          />
        )}
      />
    );
  }
}
