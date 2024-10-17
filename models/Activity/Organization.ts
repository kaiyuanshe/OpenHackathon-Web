import { Organizer, OrganizerType } from '@kaiyuanshe/openhackathon-service';
import { computed } from 'mobx';
import { groupBy } from 'web-utility';

import { TableModel } from '../Base';
import { t } from '../Base/Translation';

export const OrganizerTypeName: Record<OrganizerType, string> = {
  host: t('host'),
  organizer: t('undertake'),
  coorganizer: t('coorganizer'),
  sponsor: t('sponsor'),
  titleSponsor: t('titlesponsor'),
};

export class OrganizerModel extends TableModel<Organizer> {
  constructor(public baseURI: string) {
    super();
    this.baseURI = `${this.baseURI}/organizer`;
  }

  @computed
  get typeCount() {
    return Object.fromEntries(
      Object.entries(groupBy(this.allItems, 'type')).map(
        ([type, { length }]) => [type, length],
      ),
    ) as Record<OrganizerType, number>;
  }
}
