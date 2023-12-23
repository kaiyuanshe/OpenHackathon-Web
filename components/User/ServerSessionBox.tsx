import { Icon } from 'idea-react';
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
          href={`${strapiClient.baseURI}connect/github`}
        >
          <Icon className="me-2" name="github" /> GitHub {i18n.t('sign_in')}
        </Button>
      )}
    </div>
  ),
);
