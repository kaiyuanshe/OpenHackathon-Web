import { GitTemplate } from '@kaiyuanshe/openhackathon-service';
import { ScrollListProps } from 'mobx-restful-table';
import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import { GitCard, GitCardProps } from './Card';

export type GitListLayoutProps = Pick<
  ScrollListProps<GitTemplate>,
  'defaultData'
> &
  Pick<GitCardProps, 'renderController'>;

export const GitListLayout: FC<GitListLayoutProps> = ({
  defaultData,
  renderController,
}) => (
  <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
    {defaultData?.map(item => (
      <Col key={item.id} as="li">
        <GitCard
          className="h-100 shadow-sm"
          {...item}
          renderController={renderController}
        />
      </Col>
    ))}
  </Row>
);
