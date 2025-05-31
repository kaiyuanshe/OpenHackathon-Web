import { Loading } from 'idea-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Column, RestTable } from 'mobx-restful-table';
import { Image } from 'react-bootstrap';

import { Award, AwardModel } from '../../models/Activity/Award';
import { i18n, I18nContext } from '../../models/Base/Translation';

export const AwardTargetName = ({ t }: typeof i18n) => ({
  individual: t('personal'),
  team: t('team'),
});

@observer
export class AwardList extends ObservedComponent<{ store: AwardModel }, typeof i18n> {
  static contextType = I18nContext;

  @computed
  get columns(): Column<Award>[] {
    const i18n = this.observedContext;
    const { t } = i18n;

    return [
      { key: 'quantity', renderHead: t('quantity') },
      {
        key: 'target',
        renderHead: t('type'),
        renderBody: ({ target }) => AwardTargetName(i18n)[target],
      },
      {
        key: 'pictures',
        renderHead: t('photo'),
        renderBody: ({ pictures }) =>
          pictures && <Image src={pictures?.[0].uri} alt={pictures?.[0].description} />,
      },
      { key: 'name', renderHead: t('name') },
      { key: 'description', renderHead: t('description') },
    ];
  }

  render() {
    const i18n = this.observedContext,
      { store } = this.props;
    const { downloading, uploading } = store;

    const loading = downloading > 0 || uploading > 0;

    return (
      <>
        <RestTable translator={i18n} store={store} columns={this.columns} editable deletable />

        {loading && <Loading />}
      </>
    );
  }
}
