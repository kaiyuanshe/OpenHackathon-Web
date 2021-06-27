import { DataItem } from './service';
import { ActivitySubModel, TableModel } from './BaseModel';
import { User } from './User';

export interface TeamMember extends DataItem {
    userId: string;
    status: string;
    desciption: string;
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

    boot(activityName: string, teamId: string) {
        this.singleBase = `hackathon/${activityName}/team/${teamId}/member`;
        this.multipleBase = `${this.singleBase}s`;
        return this;
    }
}

export class TeamModel extends ActivitySubModel<Team> {
    subBase = 'team';

    members: TeamMemberModel = new TeamMemberModel();
}
