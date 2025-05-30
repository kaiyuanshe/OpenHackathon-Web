import { Enrollment } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { FC, PureComponent, useContext } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { statusName } from '../../models/Activity/Enrollment';
import { i18n, I18nContext } from '../../models/Base/Translation';
import styles from '../../styles/participant.module.less';
import { XScrollListProps } from '../layout/ScrollList';

export interface EnrollmentListLayoutProps extends XScrollListProps<Enrollment> {
  onPopUp?: (extensions: Enrollment['form']) => any;
  onVerify?: (userId: number, status: Enrollment['status']) => any;
}

export const EnrollmentListLayout: FC<EnrollmentListLayoutProps> = observer(
  ({ defaultData = [], onPopUp, onVerify }) => {
    const { t } = useContext(I18nContext);

    return (
      <Table className={styles['container-table']}>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('user_name')}</th>
            <th>{t('mail')}</th>
            <th>{t('phone_number')}</th>
            {/* <th>{t('contact_address')}</th> */}
            <th>{t('enrollment')}</th>
            <th>{t('status')}</th>
          </tr>
        </thead>
        <tbody>
          {defaultData.map(
            ({ createdBy: { id, email, mobilePhone, name }, status, form, createdAt }, index) => (
              <tr key={id}>
                <td>{index + 1}</td>
                <td>
                  <Button variant="link" onClick={() => onPopUp?.(form)}>
                    {name || email || mobilePhone}
                  </Button>
                </td>
                <td>{email}</td>
                <td>{mobilePhone}</td>
                {/* <td>{address}</td> */}
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
  },
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
