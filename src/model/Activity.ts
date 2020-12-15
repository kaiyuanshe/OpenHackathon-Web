import { DataItem, service, PageData } from './service';
import { TableModel, loading } from './BaseModel';
import { Coord, coordsOf } from './AMap';
import { Team } from './Team';

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
    description: string;
    tags: string[];
    banners: string[];
    location: string;
    headcount_limit: number;
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

export class ActivityModel extends TableModel<Activity> {
    singleBase = 'hackathon';
    multipleBase = 'hackathon/list';

    async getEventList(name: string) {
        const {
            body: { items }
        } = await service.get<PageData<Event>>(
            `${this.singleBase}/notice/list?${new URLSearchParams({
                hackathon_name: name,
                order_by: 'time'
            })}`
        );
        return items;
    }

    async getTeamList(name: string) {
        const { body } = await service.get<Team[]>(
            `${this.singleBase}/team/list`,
            { hackathon_name: name }
        );
        return body;
    }

    @loading
    async getOne(name: string) {
        const [{ body }, events, teams] = await Promise.all([
            service.get<Activity>(this.singleBase, { hackathon_name: name }),
            this.getEventList(name),
            this.getTeamList(name)
        ]);
        (body.events = events), (body.teams = teams);

        if (body.location) body.coord = (await coordsOf(body.location))[0];

        return (this.current = body);
    }

    @loading
    async createActivity(data: Partial<Activity>) {
        const { body } = await service.post<Activity>('admin/hackathon', data);

        return (this.current = body);
    }

    @loading
    async updateActivity(data: Partial<Activity>) {
        const { body } = await service.put<Activity>('admin/hackathon', data, {
            hackathon_name: data.name
        });

        return (this.current = body);
    }
}
