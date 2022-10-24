import { t } from 'i18next';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { Button, Dropdown } from 'react-bootstrap';
//i18n
import { useTranslation } from 'react-i18next';

import sessionStore from '../../models/Session';
import { SessionBox } from './SessionBox';
const { localStorage } = globalThis;

const UserBar = observer(() => {
  const { user } = sessionStore;
  const showName = user ? user.nickname || user.email || user.phone : '';
  const { i18n } = useTranslation();
  const changeLanguage = (language: string) => {
    i18n.changeLanguage((localStorage.language = language));
  };
  return !user ? (
    <SessionBox>
      <Button>登入</Button>
    </SessionBox>
  ) : (
    <>
      <Link href="/activity/create" passHref>
        <Button variant="success" className="my-2 my-md-0 me-3">
          {t('create_hackathons')}
        </Button>
      </Link>
      <Dropdown className="my-2 my-md-0">
        <Dropdown.Toggle>{showName}</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href={`/user/${user.id}`}>个人主页</Dropdown.Item>
          <Dropdown.Item onClick={() => sessionStore.signOut()}>
            {t('sign_out')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown className="mx-2 my-2 my-md-0">
        <Dropdown.Toggle>
          {t('language')}: {t(i18n.language)}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => changeLanguage('en-US')}>
            {t('en-US')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => changeLanguage('zh-Hans')}>
            {t('zh-Hans')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => changeLanguage('zh-Hant-TW')}>
            中文繁体-台湾
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
});
export default UserBar;
