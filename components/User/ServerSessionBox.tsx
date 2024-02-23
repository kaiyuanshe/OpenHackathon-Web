import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react';
import { JWTProps } from 'next-ssr-middleware';
import { FC, HTMLAttributes } from 'react';
import { Button } from 'react-bootstrap';

import { i18n } from '../../models/Base/Translation';
import { strapiClient } from '../../models/User/Session';

export type ServerSessionBoxProps = HTMLAttributes<HTMLDivElement> & JWTProps;

export const ServerSessionBox: FC<ServerSessionBoxProps> = observer(
  ({ jwtPayload, children, ...props }) => (
    <div {...props}>
      {jwtPayload ? (
        children
      ) : (
        <Button
          variant="dark"
          size="lg"
          href={`${strapiClient.baseURI}connect/auth0`}
        >
          <FontAwesomeIcon className="me-2" icon={faShieldHalved} />
          Auth0 {i18n.t('sign_in')}
        </Button>
      )}
    </div>
  ),
);
