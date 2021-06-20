import { DataItem, service } from './service';
import { loading, TableModel } from './BaseModel';

export interface Registration extends DataItem {
    hackathonName: string;
    userId: string;
    status: 'none' | 'pendingApproval' | 'approved' | 'rejected';
}

export class RegistrationModel extends TableModel<Registration> {
    singleBase = '';
    multipleBase = '';

    constructor(activityName: string) {
        super();
        this.singleBase = `hackathon/${activityName}/enrollment`;
        this.multipleBase = `${this.singleBase}s`;
    }

    @loading
    async createOne() {
        const { body } = await service.put<Registration>(this.singleBase, {});

        return (this.current = body);
    }
}
