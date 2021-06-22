import { DataItem, Asset } from './service';
import { TableModel } from './BaseModel';

export interface Award extends DataItem {
    name: string;
    description: string;
    quantity: number;
    target: 'team' | 'individual';
    pictures: Asset[];
}

export class AwardModel extends TableModel<Award> {
    singleBase = '';
    multipleBase = '';

    constructor(activityName: string) {
        super();
        this.singleBase = `hackathon/${activityName}/award`;
        this.multipleBase = `${this.singleBase}s`;
    }
}
