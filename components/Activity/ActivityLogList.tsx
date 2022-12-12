import { observer } from 'mobx-react';
import { Badge, ListGroup } from 'react-bootstrap';

import { Log, LogModel } from '../../models/Log';
import { XScrollList, XScrollListProps } from '../ScrollList';

export interface ActivityLogListProps extends XScrollListProps<Log> {
  store: LogModel;
}

export const ActivityLogListLayout = ({
  defaultData = [],
}: Pick<ActivityLogListProps, 'defaultData'>) => (
  <ListGroup as="ol" numbered>
    {defaultData.map(({ id, message, activityLogType }) => (
      <ListGroup.Item
        key={id}
        as="li"
        className="d-flex justify-content-between"
      >
        <div className="ms-2 me-auto">{message}</div>
        <Badge>{activityLogType}</Badge>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

@observer
export class ActivityLogList extends XScrollList<ActivityLogListProps> {
  store = this.props.store;

  constructor(props: ActivityLogListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return <ActivityLogListLayout defaultData={this.store.allItems} />;
  }
}
