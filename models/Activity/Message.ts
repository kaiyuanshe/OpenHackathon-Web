import { Announcement, BaseFilter } from '@kaiyuanshe/openhackathon-service';

import { Filter, TableModel } from '../Base';
import { i18n } from '../Base/Translation';

export enum AnnouncementType {
  Hackathon = 'hackathon',
}

export const AnnouncementTypeName = ({ t }: typeof i18n) => ({
  [AnnouncementType.Hackathon]: t('hackathon_message'),
});

export type AnnouncementFilter = Filter<Announcement> & BaseFilter;

export class AnnouncementModel extends TableModel<Announcement, AnnouncementFilter> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${baseURI}/announcement`;
  }
}
