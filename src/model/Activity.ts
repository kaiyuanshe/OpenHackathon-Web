import { observable } from 'mobx';

import { DataItem, ListFilter, service, PageData } from './service';
import { User } from './User';
import { coordsOf, Coord } from './AMap';

export interface Organization extends DataItem {
    name: string;
    description: string;
    organization_type: number;
    logo: string;
    homepage: string;
}

export interface Event extends DataItem {
    event: number;
    category: number;
    is_read: boolean;
    content: string;
    hackathon: string;
    link: string;
}

export interface Team extends DataItem {
    works: any[];
    member_count: number;
    project_name: string;
    cover: string;
    members: User[];
    awards: any[];
    logo: string;
    leader: User;
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
    coord?: Coord;
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
    events?: Event[];
    teams?: Team[];
}

export class ActivityModel {
    @observable
    list: Activity[] = [];

    pageIndex = 0;
    pageSize = 10;

    @observable
    totalCount = 0;

    @observable
    current: Activity = {} as Activity;

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

    async getEventList(name: string) {
        const {
            body: { items }
        } = await service.get<PageData<Event>>(
            'hackathon/notice/list?' +
                new URLSearchParams({
                    hackathon_name: name,
                    order_by: 'time'
                })
        );
        return items;
    }

    async getTeamList(name: string) {
        const { body } = await service.get<Team[]>('hackathon/team/list', {
            hackathon_name: name
        });
        return body;
    }

    async getOne(name: string) {
        const [{ body }, events, teams] = await Promise.all([
            service.get<Activity>('hackathon', {
                hackathon_name: name
            }),
            this.getEventList(name),
            this.getTeamList(name)
        ]);

        (body.events = events), (body.teams = teams);

        if (body.location) body.coord = (await coordsOf(body.location))[0];

        return (this.current = body);
    }
}
