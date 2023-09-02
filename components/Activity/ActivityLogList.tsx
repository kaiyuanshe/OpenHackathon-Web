import { ScrollListProps } from 'mobx-restful-table';
import { Badge, ListGroup } from 'react-bootstrap';

import { Log, LogModel } from '../../models/Log';

export interface ActivityLogListProps extends ScrollListProps<Log> {
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
        className="d-flex justify-content-between align-items-center"
      >
        <div className="ms-2 me-auto">{message}</div>
        <Badge>{activityLogType}</Badge>
      </ListGroup.Item>
    ))}
  </ListGroup>
);
