import { DataItem, service } from './service';
import { ActivitySubModel, TableModel, loading } from './BaseModel';
import { User } from './User';

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
    async leave() {
        await service.delete(this.singleBase);
    }

    @loading
    async updateRole(userId: string, role: string) {
        await service.post(`${this.singleBase}/${userId}/updateRole`, {
            role
        });
    }

    @loading
    async approveOne(userId: string) {
        await service.post(`${this.singleBase}/${userId}/approve`);
    }
}

export class TeamModel extends ActivitySubModel<Team> {
    subBase = 'team';

    members: TeamMemberModel = new TeamMemberModel();

    @loading
    async getOne(id: string) {
        super.getOne(id);
        this.members.boot(this.singleBase, id);
        return this.current
    }
}
