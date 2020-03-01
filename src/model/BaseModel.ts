import { observable } from 'mobx';
import { DataItem, service, PageData, ListFilter } from './service';

export abstract class BaseModel<
    T extends DataItem = DataItem,
    F extends ListFilter = ListFilter
> {
    @observable
    loading = false;

    @observable
    noMore = false;

    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list: T[] = [];

    abstract baseURI: string;

    reset() {
        this.loading = this.noMore = false;

        this.list.length = this.pageIndex = this.totalCount = 0;
    }

    async getNextPage(filter: F, reset?: boolean) {
        if (reset) this.reset();

        if (this.loading || this.noMore) return;

        if (this.pageIndex && this.list.length === this.totalCount) {
            this.noMore = true;
            return;
        }
        this.loading = true;

        const {
            body: { total, items }
        } = await service.get<PageData<T>>(
            `${this.baseURI}?${new URLSearchParams({
                order_by: 'time',
                ...filter,
                page: this.pageIndex + 1 + '',
                per_page: this.pageSize + ''
            })}`
        );
        this.pageIndex++, (this.totalCount = total);

        this.list = this.list.concat(items);

        this.loading = false;

        if (items[0]) return items;

        this.noMore = true;
    }

    abstract async getOne(...params: any[]): Promise<T>;
}
