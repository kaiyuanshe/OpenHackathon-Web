import { PureComponent } from 'react';
import { Button, Dropdown } from 'react-bootstrap';

import { User } from '../models/User';
import { request } from '../pages/api/core';
import { getClientSession } from '../pages/api/user/session';

interface State {
  user?: User;
}

export class UserBar extends PureComponent<{}, State> {
  state: Readonly<State> = {};

  async componentDidMount() {
    try {
      const user = await getClientSession();

      this.setState({ user });
    } catch {}
  }

  async signOut() {
    await request('user/session', 'DELETE');

    location.replace('/');
  }

  render() {
    const { user } = this.state;

    return (
      <div>
        {!user ? (
          <Button href="/user/sign-in/">登入</Button>
        ) : (
          <Dropdown>
            <Dropdown.Toggle>{user.nickname}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href={`/user/${user.id}`}>个人主页</Dropdown.Item>
              <Dropdown.Item onClick={this.signOut}>登出</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    );
  }
}
