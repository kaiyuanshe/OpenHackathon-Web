import { HTMLInputProps } from 'web-utility/source/DOM-type';

import { DataItem, ListFilter, service } from './service';
import { ActivitySubModel, loading } from './BaseModel';
import { User } from './User';

export interface Question extends Pick<HTMLInputProps, 'type' | 'required'> {
    title: string;
    options?: string[];
    multiple?: boolean;
}

export enum RegistrationStatus {
    none = 'none',
    pending = 'pendingApproval',
    approved = 'approved',
    rejected = 'rejected'
}

interface ExtraField {
    name: string;
    value: string;
}

export interface Registration extends DataItem {
    hackathonName: string;
    userId: string;
    user: User;
    status: RegistrationStatus;
    extensions: ExtraField[];
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
    async createOne(data: Partial<Pick<Registration, 'extensions'>> = {}) {
        const { body } = await service.put<Registration>(this.singleBase, data);

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
