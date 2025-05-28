import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Button, Dropdown } from 'react-bootstrap';

import { I18nContext } from '../../models/Base/Translation';
import sessionStore from '../../models/User/Session';
import LanguageMenu from './LanguageMenu';

const UserBar = observer(() => {
  const { t } = useContext(I18nContext),
    { user } = sessionStore;

  const showName = user?.name || user?.email || user?.mobilePhone || '';

  return (
    <>
      <Button variant="success" href="/activity/create">
        {t('create_hackathons')}
      </Button>

      {user && (
        <Dropdown>
          <Dropdown.Toggle>{showName}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href={`/user/${user.id}`}>{t('home_page')}</Dropdown.Item>
            <Dropdown.Item
              title={t('edit_profile_tips')}
              target="_blank"
              href="https://github.com/settings/profile"
              onClick={() => sessionStore.signOut(true)}
            >
              {t('edit_profile')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => sessionStore.signOut(true)}>
              {t('sign_out')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      <LanguageMenu />
    </>
  );
});
export default UserBar;
