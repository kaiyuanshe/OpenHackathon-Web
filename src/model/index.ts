import { History } from 'cell-router/source';
import { ActivityModel } from './Activity';

export const history = new History();
export const activity = new ActivityModel();

export * from './service';
export * from './Activity';
