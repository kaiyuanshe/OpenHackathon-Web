import { Organizer } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Card } from 'react-bootstrap';

import { OrganizerTypeName } from '../../models/Activity/Organization';
import { I18nContext } from '../../models/Base/Translation';

export const OrganizationCard: FC<Organizer> = observer(
  ({ name, description, type, logo, url }) => {
    const i18n = useContext(I18nContext);

    return (
      <Card>
        <Card.Img className="p-3" src={logo?.uri} alt={logo?.name} title={logo?.name} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle>{OrganizerTypeName(i18n)[type]}</Card.Subtitle>
          <Card.Text className="border-top my-2 pt-2">{description}</Card.Text>
          {url && <a className="stretched-link" href={url} />}
        </Card.Body>
      </Card>
    );
  },
);
