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
            body: { value }
        } = await service.get<PageData<T>>(
            `${this.multipleBase}?${new URLSearchParams({
                ...filter,
                top: this.pageSize + ''
            })}`
        );
        this.pageIndex++;

        this.list = this.list.concat(value);

        this.loading = false;

        if (value[0]) return value;

        this.noMore = true;
    }

    abstract getOne(...params: any[]): Promise<T>;
}
