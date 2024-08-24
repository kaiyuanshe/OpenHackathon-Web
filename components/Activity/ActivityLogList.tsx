import { ActivityLog } from '@kaiyuanshe/openhackathon-service';
import { ScrollListProps } from 'mobx-restful-table';
import { Badge, ListGroup } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { LogModel } from '../../models/Activity/Log';

export interface ActivityLogListProps extends ScrollListProps<ActivityLog> {
  store: LogModel;
}

export const OperationName = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
};

export const ActivityLogListLayout = ({
  defaultData = [],
}: Pick<ActivityLogListProps, 'defaultData'>) => (
  <ListGroup as="ol" numbered>
    {defaultData.map(
      ({ id, createdAt, createdBy, operation, tableName, recordId }) => (
        <ListGroup.Item
          key={id}
          as="li"
          className="d-flex justify-content-between align-items-center gap-2"
        >
          <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          {createdBy.name}
          <Badge>{OperationName[operation]}</Badge>
          <code>{tableName}</code>
          {recordId}
        </ListGroup.Item>
      ),
    )}
  </ListGroup>
);
