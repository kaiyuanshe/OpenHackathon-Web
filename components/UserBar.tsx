import { PureComponent, useContext } from 'react';
import { Button, Dropdown, Nav } from 'react-bootstrap';
import Link from 'next/link';

import { User } from '../models/User';
import { request } from '../pages/api/core';
import { getClientSession } from '../pages/api/user/session';
import { AuthContext } from '../context/AuthContext';

interface State {
  user?: User;
}

export class UserBar extends PureComponent<{}, State> {
  state: Readonly<State> = {};
  static contextType = AuthContext;

  // async componentDidMount() {
  //   try {
  //     const user = await getClientSession();
  //     this.setState({ user });
  //   } catch {}
  // }

  async signOut() {
    await request('user/session', 'DELETE');

    location.replace('/');
  }

  render() {
    // const { user } = this.state;
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
            <Dropdown.Item onClick={this.signOut}>登出</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
}
