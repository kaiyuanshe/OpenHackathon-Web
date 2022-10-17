import { debounce } from 'lodash';
import { observable } from 'mobx';
import { ListModel, Stream } from 'mobx-restful';
import { Component } from 'react';
import { EdgePosition, ScrollBoundary, Loading } from 'idea-react';

import { Base, Filter } from '../models/Base';
import { t } from 'i18next';

export interface ScrollListProps<T extends Base = Base> {
  value?: T[];
  selectedIds?: string[];
  onSelect?: (selectedIds: string[]) => any;
}

interface ScrollListClass<P = any> {
  Layout: (props: P) => JSX.Element;
}
type DataType<P> = P extends ScrollListProps<infer D> ? D : never;

export abstract class ScrollList<
  P extends ScrollListProps,
> extends Component<P> {
  abstract store: ListModel<DataType<P>>;

  filter: Filter<DataType<P>> = {};

  extraProps?: Partial<P>;

  @observable
  selectedIds: string[] = [];

  static Layout: ScrollListClass['Layout'] = () => <></>;

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

  render() {
    const { Layout } = this.constructor as unknown as ScrollListClass,
      { value, onSelect, ...props } = this.props,
      { extraProps, selectedIds } = this,
      { downloading, uploading, noMore, allItems } = this.store;

    return (
      <ScrollBoundary onTouch={this.loadMore}>
        <div>
          {(downloading > 0 || uploading > 0) && <Loading />}

          <Layout
            {...props}
            {...extraProps}
            value={allItems}
            selectedIds={selectedIds}
            onSelect={(list: string[]) =>
              (this.selectedIds = list) && onSelect?.(list)
            }
          />
          <footer className="mt-4 text-center text-muted small">
            {noMore || !allItems.length ? t('no_more') : '上拉加载更多……'}
          </footer>
        </div>
      </ScrollBoundary>
    );
  }
}
