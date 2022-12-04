import { observer } from 'mobx-react';
import Link from 'next/link';
import { Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import sessionStore from '../../models/Session';
import LanguageMenu from './LanguageMenu';
import { SessionBox } from './SessionBox';

const UserBar = observer(() => {
  const { t } = useTranslation();

  const { user } = sessionStore;
  const showName = user ? user.nickname || user.email || user.phone : '';

  return (
    <>
      {!user ? (
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
          <Dropdown className="my-2 my-md-0 me-3">
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
        </>
      )}
      <LanguageMenu />
    </>
  );
});
export default UserBar;
