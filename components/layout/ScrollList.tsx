import { Loading } from 'idea-react';
import { observable } from 'mobx';
import { DataObject } from 'mobx-restful';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';

import { i18n } from '../../models/Translation';

export interface XScrollListProps<T extends DataObject = DataObject>
  extends Pick<ScrollListProps<T>, 'defaultData'> {
  selectedIds?: string[];
  onSelect?: (selectedIds: string[]) => any;
}

export abstract class XScrollList<
  P extends XScrollListProps,
> extends ScrollList<P> {
  translator = i18n;

  @observable
  selectedIds: string[] = [];

  onSelect = (list: string[]) =>
    (this.selectedIds = list) && this.props.onSelect?.(list);

  render() {
    const { downloading, uploading } = this.store;

    return (
      <>
        {(downloading > 0 || uploading > 0) && <Loading />}

        {super.render()}
      </>
    );
  }
}
