import { observable } from 'mobx';

import { DataItem, service } from './service';
import { User } from './User';

interface Membership {
    status: number;
    join_time: number;
    user: User;
}

export interface Team extends DataItem {
    works: any[];
    member_count: number;
    project_name: string;
    cover: string;
    members: Membership[];
    awards: any[];
    logo: string;
    leader: User;
    hackathon: string;
    azure_keys: any[];
    templates: any[];
    assets: any;
    scores: any[];
    is_frozen: boolean;
}

export class TeamModel {
    @observable
    current: Team = {} as Team;

    async getOne(activity: string, id: string) {
        const { body } = await service.get<Team>('team?id=' + id, {
            hackathon_name: activity
        });
        return (this.current = body);
    }
}
