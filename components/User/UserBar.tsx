import { observer } from 'mobx-react';
import { Button, Dropdown } from 'react-bootstrap';
import Link from 'next/link';

import { SessionBox } from './SessionBox';
import sessionStore from '../../models/Session';
import { useRouter } from 'next/router';

const UserBar = observer(() => {
  const { user } = sessionStore;
  const { asPath } = useRouter();

  return !user ? (
    <SessionBox>
      <Button>登入</Button>
    </SessionBox>
  ) : (
    <>
      <Link href="/activity/create" passHref>
        <Button variant="success" className="my-2 my-md-0 me-3">
          创建黑客松活动
        </Button>
      </Link>
      <Link href={asPath} locale="en-US">
        en-US
      </Link>
      <Link href={asPath} locale="zh-Hans">
        zh-Hans
      </Link>
      <Dropdown className="my-2 my-md-0">
        <Dropdown.Toggle>{user.nickname}</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href={`/user/${user.id}`}>个人主页</Dropdown.Item>
          <Dropdown.Item onClick={() => sessionStore.signOut()}>
            登出
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
});
export default UserBar;
