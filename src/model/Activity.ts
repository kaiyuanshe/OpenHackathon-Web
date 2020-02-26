import { observable } from 'mobx';
import { DataItem, ListFilter, service, PageData } from './service';

export interface Organization extends DataItem {
    name: string;
    description: string;
    organization_type: number;
    logo: string;
    homepage: string;
}

export interface Activity extends DataItem {
    type: number;
    display_name: string;
    ribbon: string;
    short_description: string;
    description: string;
    tags: string[];
    banners: string[];
    location: string;
    registration_start_time: number;
    registration_end_time: number;
    event_start_time: number;
    event_end_time: number;
    judge_start_time: number;
    judge_end_time: number;
    awards: any[];
    status: number;
    organizers: Organization[];
    stat: { register: number; like: number };
}

export class ActivityModel {
    @observable
    list: Activity[] = [];

    pageIndex = 0;
    pageSize = 10;

    @observable
    totalCount = 0;

    async getList({
        order_by = 'time',
        page = '1',
        per_page = '10'
    }: ListFilter = {}) {
        (this.pageIndex = +page), (this.pageSize = +per_page);

        const {
            body: { items, total }
        } = await service.get<PageData<Activity>>(
            'hackathon/list?' +
                new URLSearchParams({
                    order_by,
                    page,
                    per_page
                })
        );
        this.totalCount = total;

        return (this.list = items);
    }
}
