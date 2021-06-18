import { observable } from 'mobx';

import { DataItem, service, PageData, Asset } from './service';
import { TableModel, loading } from './BaseModel';
import { Coord, coordsOf } from './AMap';
import { Team } from './Team';
import { Registration, RegistrationList } from './User';

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
    tags: string[];
    banners: Asset[];
    location: string;
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
    teams?: Team[];
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

export class ActivityModel extends TableModel<Activity> {
    singleBase = 'hackathon';
    multipleBase = 'hackathons';

    @observable
    userList: RegistrationList[] = [];

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
            service.get<Activity>(`${this.singleBase}/${name}`),
            this.getEventList(name),
            this.getTeamList(name)
        ]);
        (body.events = events), (body.teams = teams);

        if (body.location) body.coord = (await coordsOf(body.location))[0];

        return (this.current = body);
    }

    @loading
    async updateOne({ name, ...data }: Partial<ActivityData>) {
        const {
                body: { nameAvailable }
            } = await service.post<NameCheckResult>(
                'hackathon/checkNameAvailability',
                { name }
            ),
            path = `hackathon/${name}`;

        const { body } = await (nameAvailable
            ? service.put<Activity>(path, data)
            : service.patch<Activity>(path, data));

        return (this.current = body);
    }

    @loading
    async publishOne(name = this.current.name) {
        if (name !== this.current.name) await this.getOne(name);

        const { isAdmin } = this.current.roles;

        const { body } = await service.post<Activity>(
            `hackathon/${name}/${isAdmin ? 'publish' : 'requestPublish'}`
        );
        return (this.current = body);
    }

    @loading
    async getRegistrations(name = this.current.name) {
        const { body } = await service.get<RegistrationList[]>(
            'admin/registration/list',
            { hackathon_name: name }
        );
        return (this.userList = body);
    }

    @loading
    async addRegistration(name = this.current.name) {
        const { body } = await service.post<Registration>(
            'user/registration',
            {},
            { hackathon_name: name }
        );
        return body;
    }

    @loading
    async updateRegistration(
        id: string,
        status: number,
        name = this.current.name
    ) {
        const { body } = await service.put<Registration>(
            'admin/registration',
            { id, status },
            { hackathon_name: name }
        );
        return body;
    }

    @loading
    async getActivityConfig(name = this.current.name) {
        const { body } = await service.get<ActivityConfig>(
            'admin/hackathon/config',
            { hackathon_name: name }
        );
        return (this.config = body);
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
