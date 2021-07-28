import { DataItem, ListFilter, service } from './service';
import { ActivitySubModel, TableModel, loading } from './BaseModel';
import { User } from './User';
import site_logo from '../image/logo.png';

export enum TeamMemberStatus {
    none = 'none',
    pending = 'pendingApproval',
    approved = 'approved',
    rejected = 'rejected'
}

export interface TeamMember extends DataItem {
    userId: string;
    status: TeamMemberStatus;
    description: string;
    role: string;
    user: User;
}

export interface Team extends DataItem {
    works: any[];
    membersCount: number;
    displayName: string;
    description: string;
    cover: string;
    awards: any[];
    logo: string;
    creator: User;
    hackathonName: string;
    azure_keys: any[];
    templates: any[];
    assets: any;
    scores: any[];
    is_frozen: boolean;
    autoApprove: boolean;
}

export class TeamMemberModel extends TableModel<TeamMember> {
    singleBase = '';
    multipleBase = '';

    boot(base: string, teamId: string) {
        this.singleBase = `${base}/${teamId}/member`;
        this.multipleBase = `${this.singleBase}s`;
        return this;
    }

    @loading
    leave() {
        return service.delete(this.singleBase);
    }

    @loading
    async updateRole(userId: string, role: string) {
        await service.post(`${this.singleBase}/${userId}/updateRole`, {
            role
        });
        const member = this.list.find(m => m.userId === userId);
        if (member && role !== member.role) member.role = role;
    }

    @loading
    async approveOne(userId: string) {
        await service.post(`${this.singleBase}/${userId}/approve`);
        const member = this.list.find(m => m.userId === userId);
        if (member) member.status = TeamMemberStatus.approved;
    }
}

export class TeamModel extends ActivitySubModel<Team> {
    subBase = 'team';

    members: TeamMemberModel = new TeamMemberModel();

    static fixLogo({ logo, creator, ...data }: Team): Team {
        creator.photo ||= site_logo;

        return {
            ...data,
            logo: logo || creator.photo,
            creator
        };
    }

    async getOne(id: string) {
        const team = await super.getOne(id);

        this.members.boot(this.singleBase, id);

        return (this.current = TeamModel.fixLogo(team));
    }

    async getNextPage(
        filter: ListFilter<Team> = {} as ListFilter<Team>,
        reset = false
    ) {
        const list = await super.getNextPage(filter, reset);

        return (this.list = list.map(TeamModel.fixLogo));
    }
}
