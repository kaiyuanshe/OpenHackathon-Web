import { observable } from 'mobx';

import { DataItem, ListFilter, PageData, service } from './service';

export abstract class BaseModel {
    @observable
    loading = false;
}

export function loading(target: any, key: string, meta: PropertyDescriptor) {
    const origin: (...data: any[]) => Promise<any> = meta.value;

    meta.value = async function (this: BaseModel, ...data: any[]) {
        this.loading = true;
        try {
            return await origin.apply(this, data);
        } finally {
            this.loading = false;
        }
    };
}

export abstract class TableModel<
    T extends DataItem = DataItem,
    F extends ListFilter = ListFilter
> extends BaseModel {
    abstract singleBase: string;
    abstract multipleBase: string;

    @observable
    noMore = false;

    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list: T[] = [];

    @observable
    current: T = {} as T;

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
            `${this.multipleBase}?${new URLSearchParams({
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

    abstract getOne(...params: any[]): Promise<T>;
}
