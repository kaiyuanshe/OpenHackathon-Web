import { History } from 'cell-router/source';

import { SessionModel } from './Session';
import { UserModel } from './User';
import { ActivityModel } from './Activity';

export const history = new History();
export const session = new SessionModel();
export const user = new UserModel();
export const activity = new ActivityModel(session);

export * from './static';
export * from './service';
export * from './AMap';
export * from './User';
export * from './Activity';
export * from './Award';
export * from './Registration';
export * from './Team';
