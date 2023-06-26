import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';

import { GitModel, GitRepository } from '../../models/Git';
import { XScrollList, XScrollListProps } from '../layout/ScrollList';
import { GitTeamCard, GitTeamCardProps } from './GitTeamCard';

export interface GitListProps
  extends XScrollListProps<GitRepository>,
    Pick<GitTeamCardProps, 'renderController'> {
  store: GitModel;
}

@observer
export class TeamGitList extends XScrollList<GitListProps> {
  store = this.props.store;

  constructor(props: GitListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    const { renderController } = this.props,
      { allItems } = this.store;

    return (
      <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
        {allItems.map(item => (
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
  }
}
