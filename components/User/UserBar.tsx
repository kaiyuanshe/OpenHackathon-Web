import { observer } from 'mobx-react';
import { Button, Dropdown } from 'react-bootstrap';

import { i18n } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';
import LanguageMenu from './LanguageMenu';
import { SessionBox } from './SessionBox';

const UserBar = observer(() => {
  const { t } = i18n;
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
          <Button variant="success" href="/activity/create">
            {t('create_hackathons')}
          </Button>

          <Dropdown>
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
