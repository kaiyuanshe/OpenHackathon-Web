import { ActivityLog, Base } from '@kaiyuanshe/openhackathon-service';
import { IDType } from 'mobx-restful';

import { TableModel } from '../Base';

export interface Log extends Base {
  operatorId: IDType;
  message: string;
  messageFormat: string;
  activityLogType: string;
}

export class LogModel extends TableModel<ActivityLog> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${baseURI}/activityLogs`;
  }
}
