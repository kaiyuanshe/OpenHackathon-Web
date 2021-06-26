import { DataItem, Asset } from './service';
import { ActivitySubModel } from './BaseModel';

export enum AwardTarget {
    individual = 'individual',
    team = 'team'
}

export interface Award extends DataItem {
    name: string;
    description: string;
    quantity: number;
    target: AwardTarget;
    pictures: Asset[];
}

export class AwardModel extends ActivitySubModel<Award> {
    subBase = 'award';

    async updateOne(data: Partial<Award>) {
        await super.updateOne(data);
        await this.updateList();

        return this.current;
    }
}
