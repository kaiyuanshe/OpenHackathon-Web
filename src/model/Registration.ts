import { DataItem, ListFilter, service } from './service';
import { loading, TableModel } from './BaseModel';

export enum RegistrationStatus {
    none = 'none',
    pending = 'pendingApproval',
    approved = 'approved',
    rejected = 'rejected'
}

export interface Registration extends DataItem {
    hackathonName: string;
    userId: string;
    status: RegistrationStatus;
}

export interface RegistrationQuery extends ListFilter<Registration> {
    status?: RegistrationStatus;
}

export class RegistrationModel extends TableModel<
    Registration,
    RegistrationQuery
> {
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

    async updateOne({
        userId = this.current.userId,
        status
    }: Partial<Registration>) {
        const { body } = await service.post<Registration>(
            `${this.singleBase}/${userId}/${
                status === RegistrationStatus.approved ? 'approve' : 'reject'
            }`
        );
        return (this.current = body);
    }
}
