import { observable } from 'mobx';

import { DataItem, service, PageData, Asset, ListFilter } from './service';
import { TableModel, loading } from './BaseModel';
import { Coord, coordsOf } from './AMap';
import { TeamModel } from './Team';
import { RegistrationModel } from './Registration';
import { AwardModel } from './Award';

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

export type ActivityStatus =
    | 'planning'
    | 'pendingApproval'
    | 'online'
    | 'offline';

export interface Activity extends DataItem {
    displayName: string;
    ribbon: string;
    summary: string;
    detail: string;
    tags?: string[];
    banners: Asset[];
    location?: string;
    maxEnrollment: number;
    coord?: Coord;
    enrollmentStartedAt: string;
    enrollmentEndedAt: string;
    eventStartedAt: string;
    eventEndedAt: string;
    judgeStartedAt: string;
    judgeEndedAt: string;
    status: ActivityStatus;
    organizers?: Organization[];
    events?: Event[];
    autoApprove: boolean;
    roles: {
        isAdmin: boolean;
        isJudge: boolean;
        isEnrolled: boolean;
    };
}

export type ActivityData = Omit<
    Activity,
    | 'creatorId'
    | 'createdAt'
    | 'updatedAt'
    | 'status'
    | 'coord'
    | 'events'
    | 'teams'
    | 'roles'
>;

export interface ActivityQuery extends ListFilter {
    listType?: 'online' | 'admin' | 'enrolled' | 'fresh';
}

export interface ActivityConfig {
    pre_allocate_number: number;
    freedom_team: boolean;
    login_provider: number;
    pre_allocate_enabled: boolean;
    recycle_enabled: boolean;
    max_enrollment: number;
    cloud_provide: string;
    recycle_minutes: number;
    auto_approve: boolean;
}

interface NameCheckResult {
    name: string;
    nameAvailable: boolean;
    reason: string;
    message: string;
}

export class ActivityModel extends TableModel<Activity, ActivityQuery> {
    singleBase = 'hackathon';
    multipleBase = 'hackathons';

    team = new TeamModel();
    registration = new RegistrationModel();
    award = new AwardModel();

    @observable
    config: ActivityConfig = {} as ActivityConfig;

    async getEventList(name: string) {
        const {
            body: { value }
        } = await service.get<PageData<Event>>(
            `${this.singleBase}/notice/list?${new URLSearchParams({
                hackathon_name: name,
                order_by: 'time'
            })}`
        );
        return value;
    }

    @loading
    async getOne(name: string) {
        const body = await super.getOne(name);

        if (body.location) body.coord = (await coordsOf(body.location))[0];

        this.team.boot(name);
        this.registration.boot(name);
        this.award.boot(name);

        return (this.current = body);
    }

    @loading
    async updateOne({ name, id, ...data }: Partial<ActivityData>) {
        if (!id) {
            const {
                body: { nameAvailable }
            } = await service.post<NameCheckResult>(
                'hackathon/checkNameAvailability',
                { name }
            );
            if (!nameAvailable)
                throw new URIError(`${name} can't be an Activity name`);
        }
        const path = `hackathon/${name}`;

        const { body } = await (id
            ? service.patch<Activity>(path, data)
            : service.put<Activity>(path, data));

        return (this.current = body);
    }

    @loading
    async publishOne(name = this.current.name, isAdmin = false) {
        const { body } = await service.post<Activity>(
            `hackathon/${name}/${isAdmin ? 'publish' : 'requestPublish'}`
        );
        return (this.current = body);
    }

    @loading
    async updateActivityConfig(
        data: Partial<ActivityConfig>,
        name = this.current.name
    ) {
        const { body } = await (Object.keys(this.config)[0]
            ? service.put<ActivityConfig>('admin/hackathon/config', data, {
                  hackathon_name: name
              })
            : service.post<ActivityConfig>('admin/hackathon/config', data, {
                  hackathon_name: name
              }));
        return (this.config = body);
    }
}
