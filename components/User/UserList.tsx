import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { User, UserModel } from '../../models/User';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface UserListProps extends ScrollListProps<User> {
  onSearch?: (keyword: string) => any;
  store: UserModel;
}

export const UserListLayout = ({
  value = [],
  selectedIds,
  onSelect,
  onSearch,
}: UserListProps) => (
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
            placeholder={`${t('user_name')}/${t('nickname')}/${t('mail')}`}
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
            <th>{t('nick_name')}</th>
            <th>{t('mail')}</th>
          </tr>
        </thead>
        <tbody>
          {value.map(({ username, nickname, email, id }) => (
            <tr key={id}>
              <td>
                <Form.Check
                  inline
                  type="radio"
                  name="userId"
                  required
                  value={id}
                  aria-label={id}
                  checked={selectedIds?.includes(id!)}
                  onChange={({ currentTarget: { form } }) =>
                    onSelect?.([formToJSON<{ userId: string }>(form!).userId])
                  }
                />
              </td>
              <td>{username}</td>
              <td>{nickname}</td>
              <td>{email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </form>
  </>
);

@observer
export class UserList extends ScrollList<UserListProps> {
  store = this.props.store;

  onSearch = async (keyword: string) => {
    this.store.clear();
    await this.store.getList({ keyword });
    this.props.onSearch?.(keyword);
  };

  renderList() {
    return (
      <UserListLayout
        store={this.store}
        value={this.store.allItems}
        selectedIds={this.selectedIds}
        onSelect={this.onSelect}
        onSearch={this.onSearch}
      />
    );
  }
}
