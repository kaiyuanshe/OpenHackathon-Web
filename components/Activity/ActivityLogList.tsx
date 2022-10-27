import { observer } from 'mobx-react';
import { Col } from 'react-bootstrap';

import { Log, LogModel } from '../../models/Log';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface ActivityLogListProps extends ScrollListProps<Log> {
  store: LogModel;
}

@observer
export class ActivityLogList extends ScrollList<ActivityLogListProps> {
  store = this.props.store;

  static Layout = ({ value = [] }: ActivityLogListProps) => (
    <div>
      {value.map(item => {
        <Col key={item.id}>
          <p>{item.activityLogType}</p>
          <p>{item.message}</p>
          <p>{item.messageFormat}</p>
        </Col>;
      })}
    </div>
  );
}
