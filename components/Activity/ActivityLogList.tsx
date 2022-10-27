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
    <ul>
      {value.map(item => {
        <li key={item.id}>
          <span>{item.activityLogType}</span>
          <span>{item.message}</span>
          <span>{item.messageFormat}</span>
        </li>;
      })}
    </ul>
  );
}
