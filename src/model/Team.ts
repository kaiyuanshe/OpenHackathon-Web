import { DataItem } from './service';
import { ActivitySubModel } from './BaseModel';
import { User } from './User';

interface Membership {
    status: number;
    join_time: number;
    user: User;
}

export interface Team extends DataItem {
    works: any[];
    member_count: number;
    displayName: string;
    description: string;
    cover: string;
    members: Membership[];
    awards: any[];
    logo: string;
    leader: User;
    hackathonName: string;
    azure_keys: any[];
    templates: any[];
    assets: any;
    scores: any[];
    is_frozen: boolean;
    autoApprove: boolean;
}

export class TeamModel extends ActivitySubModel<Team> {
    subBase = 'team';
}
