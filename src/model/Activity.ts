import { observable } from 'mobx';

import { DataItem, service, PageData } from './service';
import { Coord, coordsOf } from './AMap';
import { Team } from './Team';
import { BaseModel } from './BaseModel';

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

export interface Activity extends DataItem {
    type: number;
    display_name: string;
    ribbon: string;
    short_description: string;
    description: HTMLFormElement;
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
    organizers?: Organization[];
    stat: { register: number; like: number };
    events?: Event[];
    teams?: Team[];
}

export class ActivityModel extends BaseModel<Activity> {
    baseURI = 'hackathon/list';

    @observable
    current: Activity = {} as Activity;

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

    async createActivity(data: Partial<Activity>) {
        await service.post('admin/hackathon', data);
        return;
    }
}
