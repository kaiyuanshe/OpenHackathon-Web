import { Announcement, BaseFilter } from '@kaiyuanshe/openhackathon-service';

import { Filter, TableModel } from '../Base';
import { t } from '../Base/Translation';

export enum AnnouncementType {
  Hackathon = 'hackathon',
}

export const AnnouncementTypeName = () => ({
  [AnnouncementType.Hackathon]: t('hackathon_message'),
});

export type AnnouncementFilter = Filter<Announcement> & BaseFilter;

export class AnnouncementModel extends TableModel<
  Announcement,
  AnnouncementFilter
> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${baseURI}/announcement`;
  }
}
