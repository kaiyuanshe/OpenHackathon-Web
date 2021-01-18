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
import { activity, RegistrationList } from '../../model';

const Status = ['未审核', '通过', '拒绝', '自动通过'];

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

    connectedCallback() {
        const { name } = this;

        activity.getRegistrations(name);
        activity.getActivityConfig(name);

        super.connectedCallback();
    }

    handleTeamFreedom = async ({ target }: Event) =>
        activity.updateActivityConfig(
            { freedom_team: (target as HTMLFormElement).checked },
            this.name
        );

    handleAutoApprove = async ({ target }: Event) =>
        activity.updateActivityConfig(
            { auto_approve: (target as HTMLFormElement).checked },
            this.name
        );

    handleStatus(id: string, oldStatus: number) {
        return ({ target }: Event) => {
            const status = +(target as HTMLFormElement).value;

            if (status !== oldStatus)
                activity.updateRegistration(id, status, this.name);
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
            create_time,
            status,
            id
        }: RegistrationList,
        i: number
    ) => (
        <TableRow checked={false}>
            <th scope="col">{i + 1}</th>
            <th scope="col">{name}</th>
            <th scope="col">{email}</th>
            <th scope="col">{provider}</th>
            <th scope="col">{profile?.phone}</th>
            <th scope="col">{profile?.address}</th>
            <th scope="col">{create_time}</th>
            <th scope="col" style={{ width: '150px' }}>
                <Field is="select" onChange={this.handleStatus(id, status)}>
                    <option selected>{Status[status]}</option>
                    {Status.map((e, i) => (
                        <option value={i + ''}>{e}</option>
                    ))}
                </Field>
            </th>
        </TableRow>
    );

    render({ name }: ManageParticipantProps) {
        const {
            config: { freedom_team, auto_approve },
            userList
        } = activity;

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
                        checked={auto_approve}
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

                    {userList.map(this.renderUser)}
                </Table>
            </AdminFrame>
        );
    }
}
