import { observer } from 'mobx-react';
import { Badge, ListGroup } from 'react-bootstrap';

import { Log, LogModel } from '../../models/Log';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface ActivityLogListProps extends ScrollListProps<Log> {
  store: LogModel;
}

@observer
export class ActivityLogList extends ScrollList<ActivityLogListProps> {
  store = this.props.store;

  static Layout = ({ value = [] }: ActivityLogListProps) => (
    <ListGroup as="ol" numbered>
      {value.map(({ id, message, activityLogType }) => (
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
}
