import { History } from 'cell-router/source';
import { UserModel } from './User';
import { ActivityModel } from './Activity';

export const history = new History();
export const user = new UserModel();
export const activity = new ActivityModel();
export * from './static';
export * from './service';
export * from './AMap';
export * from './User';
export * from './Activity';
