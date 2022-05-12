import { PureComponent } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import Link from 'next/link';

import { User } from '../models/User';
import { AuthContext } from '../context/AuthContext';

interface State {
  user?: User;
}

export class UserBar extends PureComponent<{}, State> {
  state: Readonly<State> = {};
  static contextType = AuthContext;

  render() {
    const user = this.context.user;

    return !user ? (
      <Button href="/user/sign-in/">登入</Button>
    ) : (
      <>
        <Link href="/activity/create" passHref>
          <Button variant="success" className="me-3">
            创建黑客松活动
          </Button>
        </Link>
        <Dropdown>
          <Dropdown.Toggle>{user.nickname}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href={`/user/${user.id}`}>个人主页</Dropdown.Item>
            <Dropdown.Item onClick={this.context.logout}>登出</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
}
