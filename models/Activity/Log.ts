import { ActivityLog } from '@kaiyuanshe/openhackathon-service';

import { TableModel } from '../Base';

export class LogModel extends TableModel<ActivityLog> {
  baseURI = 'activity-log';

  constructor(path: string) {
    super();
    this.baseURI += `/${path}`;
  }
}
