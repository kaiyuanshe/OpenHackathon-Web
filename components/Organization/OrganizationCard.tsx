import { Card } from 'react-bootstrap';

import { Organization, OrganizationTypeName } from '../../models/Organization';

export const OrganizationCard = ({
  name,
  description,
  type,
  logo,
}: Organization) => (
  <Card>
    <Card.Img src={logo?.uri} alt={logo?.name} title={logo?.name} />
    <Card.Body>
      <Card.Title>{name}</Card.Title>
      <Card.Subtitle>{OrganizationTypeName[type]}</Card.Subtitle>
      <Card.Text className="border-top my-2 pt-2">{description}</Card.Text>
    </Card.Body>
  </Card>
);
