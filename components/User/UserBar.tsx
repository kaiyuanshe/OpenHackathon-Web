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
    console.log(language);
    i18n.changeLanguage((localStorage.language = language));
  };
  return !user ? (
    <SessionBox>
      <Button>{t('sign_in')}</Button>
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
          <Dropdown.Item href={`/user/${user.id}`}>
            {t('home_page')}
          </Dropdown.Item>
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
            English
          </Dropdown.Item>
          <Dropdown.Item onClick={() => changeLanguage('zh-Hans')}>
            简体中文
          </Dropdown.Item>
          <Dropdown.Item onClick={() => changeLanguage('zh-Hant-TW')}>
            中文繁體-臺灣
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
});
export default UserBar;
