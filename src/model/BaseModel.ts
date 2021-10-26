import { observable } from 'mobx';
import { buildURLData } from 'web-utility';

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
    F extends ListFilter<T> = ListFilter<T>
> extends BaseModel {
    abstract singleBase: string;
    abstract multipleBase: string;

    keyWord?: string;

    orderBy?: F['orderby'];

    pageSize = 10;

    prevPage?: string;

    @observable
    nextPage?: string;

    @observable
    list: T[] = [];

    @observable
    current: T = {} as T;

    reset() {
        this.keyWord = this.orderBy = this.nextPage = undefined;
        this.pageSize = 10;
        this.current = {} as T;
        this.list = [];
    }

    private queryId = 0;

    @loading
    async getNextPage(
        { search, orderby, top, ...filter }: F = {} as F,
        reset = false
    ) {
        if (reset) this.reset();
        else if (!this.nextPage) return this.list;

        search ??= this.keyWord;
        orderby ??= this.orderBy;
        top ??= this.pageSize;

        const currentLink =
                this.nextPage ||
                `${this.multipleBase}?${buildURLData({
                    ...filter,
                    search,
                    orderby,
                    top
                })}`,
            queryId = ++this.queryId;
        const {
            body: { nextLink, value }
        } = await service.get<PageData<T>>(currentLink);

        if (this.queryId !== queryId) return this.list;

        this.keyWord = search;
        this.orderBy = orderby;
        this.pageSize = top;
        this.prevPage = currentLink;
        this.nextPage = nextLink;

        return (this.list = reset ? value : [...this.list, ...value]);
    }

    updateList() {
        this.list = this.list.slice(0, -this.pageSize);
        this.nextPage = this.prevPage;
        return this.getNextPage();
    }

    @loading
    async getOne(id: string) {
        const { body } = await service.get<T>(`${this.singleBase}/${id}`);

        return (this.current = body);
    }

    @loading
    async updateOne({ id, ...data }: Partial<T>) {
        const { body } = await (id
            ? service.patch<T>(`${this.singleBase}/${id}`, data)
            : service.put<T>(this.singleBase, data));

        return (this.current = body);
    }

    isSame(key: any) {
        return (item: T) => item.id === key;
    }

    @loading
    async deleteOne(id: string) {
        await service.delete(`${this.singleBase}/${id}`);

        const { list } = this;
        const index = list.findIndex(this.isSame(id));

        this.list = [...list.slice(0, index), ...list.slice(index + 1)];
    }

    clearCurrent() {
        this.current = {} as T;
    }
}

export abstract class ActivitySubModel<
    D extends DataItem = DataItem,
    F extends ListFilter<D> = ListFilter<D>
> extends TableModel<D, F> {
    singleBase = '';
    multipleBase = '';
    abstract subBase: string;

    boot(activityName: string) {
        this.singleBase = `hackathon/${activityName}/${this.subBase}`;
        this.multipleBase = `${this.singleBase}s`;

        return this;
    }
}
