import { Card } from 'react-bootstrap';

import {
  Organization,
  OrganizationTypeName,
} from '../../models/Activity/Organization';

export const OrganizationCard = ({
  name,
  description,
  type,
  logo,
  url,
}: Organization) => (
  <Card>
    <Card.Img
      className="p-3"
      src={logo?.uri}
      alt={logo?.name}
      title={logo?.name}
    />
    <Card.Body>
      <Card.Title>{name}</Card.Title>
      <Card.Subtitle>{OrganizationTypeName[type]}</Card.Subtitle>
      <Card.Text className="border-top my-2 pt-2">{description}</Card.Text>
      {url && <a className="stretched-link" href={url} />}
    </Card.Body>
  </Card>
);
