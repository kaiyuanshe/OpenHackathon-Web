import { User } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { FC, PureComponent } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { i18n, t } from '../../models/Base/Translation';
import { UserFilter } from '../../models/User';
import { XScrollListProps } from '../layout/ScrollList';

export interface UserListLayoutProps extends XScrollListProps<User> {
  onSearch?: (keyword: string) => any;
}

export const UserListLayout: FC<UserListLayoutProps> = observer(
  ({ defaultData = [], selectedIds, onSelect, onSearch }) => (
    <>
      <Form
        onSubmit={event => {
          event.preventDefault();
          event.stopPropagation();

          onSearch?.(
            formToJSON<{ keyword: string }>(event.currentTarget).keyword,
          );
        }}
      >
        <Form.Group as={Row}>
          <Col>
            <Form.Control
              type="search"
              name="keyword"
              required
              aria-label="search user"
              placeholder={`${t('user_name')}/${t('nick_name')}/${t('mail')}`}
            />
          </Col>
          <Col xs sm={4}>
            <Button variant="info" type="submit">
              {t('search')}
            </Button>
          </Col>
        </Form.Group>
      </Form>

      <form>
        <Table responsive className="my-3">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('user_name')}</th>
              <th>{t('mail')}</th>
              <th>{t('phone_number')}</th>
            </tr>
          </thead>
          <tbody>
            {defaultData.map(({ name, email, mobilePhone, id }) => (
              <tr key={id}>
                <td>
                  <Form.Check
                    inline
                    type="radio"
                    name="userId"
                    required
                    value={id}
                    aria-label={id + ''}
                    checked={selectedIds?.includes(id!)}
                    onChange={({ currentTarget: { form } }) =>
                      onSelect?.([formToJSON<{ userId: number }>(form!).userId])
                    }
                  />
                </td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{mobilePhone}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </form>
    </>
  ),
);

export type UserListProps = Pick<ScrollListProps<User, UserFilter>, 'store'> &
  UserListLayoutProps;

export class UserList extends PureComponent<UserListProps> {
  onSearch = async (keywords: string) => {
    const { store, onSearch } = this.props;

    store.clear();

    await store.getList({ keywords });

    onSearch?.(keywords);
  };

  render() {
    const { props } = this;

    return (
      <ScrollList
        translator={i18n}
        store={this.props.store}
        renderList={allItems => (
          <UserListLayout
            {...props}
            defaultData={allItems}
            onSearch={this.onSearch}
          />
        )}
      />
    );
  }
}
