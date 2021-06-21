import {
    WebCellProps,
    component,
    mixin,
    watch,
    attribute,
    createCell
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { ToggleField } from 'boot-cell/source/Form/ToggleField';
import { Field } from 'boot-cell/source/Form/Field';
import { Table, TableRow } from 'boot-cell/source/Content/Table';

import { AdminFrame } from '../../component/AdminFrame';
import menu from './menu.json';
import { activity } from '../../model';
import { Registration, RegistrationStatus } from '../../model/Registration';

const StatusName = {
    [RegistrationStatus.none]: '未审核',
    [RegistrationStatus.pending]: '审核中',
    [RegistrationStatus.approved]: '通过',
    [RegistrationStatus.rejected]: '拒绝'
};

export interface ManageParticipantProps extends WebCellProps {
    name: string;
}

@observer
@component({
    tagName: 'manage-participant',
    renderTarget: 'children'
})
export class ManageParticipant extends mixin<ManageParticipantProps>() {
    @attribute
    @watch
    name = '';

    async connectedCallback() {
        const { name } = this;

        super.connectedCallback();

        if (name !== activity.current.name) await activity.getOne(name);

        await activity.registration.getNextPage({}, true);
        // activity.getActivityConfig(name);
    }

    handleTeamFreedom = async ({ target }: Event) =>
        activity.updateActivityConfig(
            { freedom_team: (target as HTMLFormElement).checked },
            this.name
        );

    handleAutoApprove = async ({ target }: Event) =>
        activity.updateOne({
            autoApprove: (target as HTMLInputElement).checked
        });

    handleStatus(userId: string, oldStatus: Registration['status']) {
        return ({ target }: Event) => {
            const status = (target as HTMLInputElement)
                .value as Registration['status'];

            if (status !== oldStatus)
                activity.registration.updateOne({ userId, status });
        };
    }

    renderUser = (
        {
            user: {
                name,
                emails: [{ email }],
                provider,
                profile
            },
            createdAt,
            status,
            userId
        }: Registration,
        i: number
    ) => (
        <TableRow checked={false}>
            <th scope="col">{i + 1}</th>
            <th scope="col">{name}</th>
            <th scope="col">{email}</th>
            <th scope="col">{provider}</th>
            <th scope="col">{profile?.phone}</th>
            <th scope="col">{profile?.address}</th>
            <th scope="col">{createdAt}</th>
            <th scope="col" style={{ width: '150px' }}>
                <Field is="select" onChange={this.handleStatus(userId, status)}>
                    <option selected>{StatusName[status]}</option>
                    {Object.entries(StatusName).map(([value, name]) => (
                        <option value={value}>{name}</option>
                    ))}
                </Field>
            </th>
        </TableRow>
    );

    render({ name }: ManageParticipantProps) {
        const { freedom_team } = activity.config,
            { autoApprove } = activity.current,
            { list } = activity.registration;

        return (
            <AdminFrame menu={menu} name={name}>
                <header className="d-flex justify-content-end">
                    <ToggleField
                        type="checkbox"
                        switch
                        className="m-2"
                        checked={freedom_team}
                        onChange={this.handleTeamFreedom}
                    >
                        允许组队
                    </ToggleField>
                    <ToggleField
                        type="checkbox"
                        switch
                        className="m-2"
                        checked={autoApprove}
                        onChange={this.handleAutoApprove}
                    >
                        自动通过
                    </ToggleField>
                </header>
                <Table className="mt-2" small center>
                    <TableRow type="head" checked={false}>
                        <th scope="col">#</th>
                        <th scope="col">注册名</th>
                        <th scope="col">邮箱</th>
                        <th scope="col">登录方式</th>
                        <th scope="col">联系电话</th>
                        <th scope="col">联系地址</th>
                        <th scope="col">报名时间</th>
                        <th scope="col">状态</th>
                    </TableRow>

                    {list.map(this.renderUser)}
                </Table>
            </AdminFrame>
        );
    }
}
