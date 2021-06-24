import { DataItem, ListFilter, service } from './service';
import { ActivitySubModel, loading } from './BaseModel';
import { User } from './User';

export enum RegistrationStatus {
    none = 'none',
    pending = 'pendingApproval',
    approved = 'approved',
    rejected = 'rejected'
}

export interface Registration extends DataItem {
    hackathonName: string;
    userId: string;
    user: User;
    status: RegistrationStatus;
}

export interface RegistrationQuery extends ListFilter<Registration> {
    status?: RegistrationStatus;
}

export class RegistrationModel extends ActivitySubModel<
    Registration,
    RegistrationQuery
> {
    subBase = 'enrollment';

    @loading
    async createOne() {
        const { body } = await service.put<Registration>(this.singleBase, {});

        return (this.current = body);
    }

    @loading
    async updateOne({
        userId = this.current.userId,
        status
    }: Partial<Registration>) {
        const { body } = await service.post<Registration>(
            `${this.singleBase}/${userId}/${
                status === RegistrationStatus.approved ? 'approve' : 'reject'
            }`,
            {}
        );
        return (this.current = body);
    }
}
