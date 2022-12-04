import { t } from 'i18next';
import { EdgePosition, Loading, ScrollBoundary } from 'idea-react';
import { debounce } from 'lodash';
import { observable } from 'mobx';
import { ListModel, Stream } from 'mobx-restful';
import { Component, ReactNode } from 'react';

import { Base, Filter } from '../models/Base';

export interface ScrollListProps<T extends Base = Base> {
  value?: T[];
  selectedIds?: string[];
  onSelect?: (selectedIds: string[]) => any;
}

type DataType<P> = P extends ScrollListProps<infer D> ? D : never;

export abstract class ScrollList<
  P extends ScrollListProps,
> extends Component<P> {
  abstract store: ListModel<DataType<P>>;

  filter: Filter<DataType<P>> = {};

  @observable
  selectedIds: string[] = [];

  onSelect = (list: string[]) =>
    (this.selectedIds = list) && this.props.onSelect?.(list);

  async componentDidMount() {
    const BaseStream = Stream<Base>;

    const store = this.store as unknown as InstanceType<
        ReturnType<typeof BaseStream>
      >,
      { value } = this.props,
      filter = this.filter as Filter<Base>;

    store.clear();

    if (value) await store.restoreList({ allItems: value, filter });

    await store.getList(filter, store.pageList.length + 1);
  }

  componentWillUnmount() {
    this.store.clear();
  }

  loadMore = debounce((edge: EdgePosition) => {
    const { store } = this;

    if (edge === 'bottom' && store.downloading < 1 && !store.noMore)
      store.getList(this.filter);
  });

  abstract renderList(): ReactNode;

  render() {
    const { downloading, uploading, noMore, allItems } = this.store;

    return (
      <ScrollBoundary onTouch={this.loadMore}>
        <div>
          {(downloading > 0 || uploading > 0) && <Loading />}

          {this.renderList()}

          <footer className="mt-4 text-center text-muted small">
            {noMore || !allItems.length ? t('no_more') : t('load_more')}
          </footer>
        </div>
      </ScrollBoundary>
    );
  }
}
