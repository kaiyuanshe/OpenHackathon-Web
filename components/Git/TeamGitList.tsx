import { ScrollListProps } from 'mobx-restful-table';
import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import { GitRepository } from '../../models/Git';
import { GitTeamCard, GitTeamCardProps } from './GitTeamCard';

export type TeamGitListLayoutProps = Pick<
  ScrollListProps<GitRepository>,
  'defaultData'
> &
  Pick<GitTeamCardProps, 'renderController'>;

export const TeamGitListLayout: FC<TeamGitListLayoutProps> = ({
  defaultData,
  renderController,
}) => (
  <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
    {defaultData?.map(item => (
      <Col as="li" key={item.id}>
        <GitTeamCard
          className="h-100 shadow-sm"
          {...item}
          renderController={renderController}
        />
      </Col>
    ))}
  </Row>
);
