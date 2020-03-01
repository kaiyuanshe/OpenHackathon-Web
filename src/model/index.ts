import { History } from 'cell-router/source';

import { UserModel } from './User';
import { ActivityModel } from './Activity';
import { TeamModel } from './Team';

export const history = new History();
export const user = new UserModel();
export const activity = new ActivityModel();
export const team = new TeamModel();
export * from './static';
export * from './service';
export * from './AMap';
export * from './User';
export * from './Activity';
export * from './Team';
