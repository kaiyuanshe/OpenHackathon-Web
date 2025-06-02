import { Announcement } from '@kaiyuanshe/openhackathon-service';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Column, RestTable, RestTableProps } from 'mobx-restful-table';

import { i18n, I18nContext } from '../../models/Base/Translation';

export type AnnouncementListProps = Omit<RestTableProps<Announcement>, 'translator' | 'columns'>;

@observer
export class AnnouncementList extends ObservedComponent<AnnouncementListProps, typeof i18n> {
  static contextType = I18nContext;

  @computed
  get columns(): Column<Announcement>[] {
    const { t } = this.observedContext;

    return [
      { key: 'title', renderHead: t('title'), required: true },
      { key: 'content', renderHead: t('content'), required: true, rows: 3 },
    ];
  }

  render() {
    const i18n = this.observedContext;

    return <RestTable {...this.props} translator={i18n} columns={this.columns} />;
  }
}
