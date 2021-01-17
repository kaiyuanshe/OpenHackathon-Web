import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { ToggleField } from 'boot-cell/source/Form/ToggleField';
import { Field } from 'boot-cell/source/Form/Field';
import { Table, TableRow } from 'boot-cell/source/Content/Table';

import { activity } from '../../model';
import { RegistrationList } from '../../model/User';
import { PageFrame } from '../../component/Navbar';
import menu from './menu.json';

const status = ['未审核', '通过', '拒绝', '自动通过'];

@observer
@component({
    tagName: 'manage-participant',
    renderTarget: 'children'
})
export class ManageParticipant extends mixin() {
    @attribute
    @watch
    name = '';

    connectedCallback() {
        this.classList.add('d-block', 'container-md');

        activity.getRegistrations(this.name);
        activity.getActivityConfig(this.name);

        super.connectedCallback();
    }

    handleTeamFreedom = async (event: Event) => {
        activity.updateActivityConfig(this.name, {
            freedom_team: (event.target as HTMLFormElement).checked
        });
    };

    handleAutoApprove = async (event: Event) => {
        activity.updateActivityConfig(this.name, {
            auto_approve: (event.target as HTMLFormElement).checked
        });
    };

    handleStatus = async (event: Event, e: RegistrationList) => {
        const status = Number((event.target as HTMLFormElement).value);
        if (status != e.status) {
            activity.updateRegistration(e.id, status, this.name);
        }
    };

    render() {
        const { freedom_team, auto_approve } = activity.config;
        return (
            <PageFrame menu={menu}>
                <ToggleField
                    type="checkbox"
                    switch
                    className="float-right mt-3"
                    checked={freedom_team}
                    onChange={this.handleTeamFreedom}
                >
                    允许组队
                </ToggleField>
                <ToggleField
                    type="checkbox"
                    switch
                    className="float-right mt-3"
                    checked={auto_approve}
                    onChange={this.handleAutoApprove}
                >
                    自动通过
                </ToggleField>
                <Table className="mt-2" small>
                    <TableRow type="head">
                        <th scope="col">
                            <Field
                                type="checkbox"
                                style={{ width: '12px', height: '12px' }}
                            />
                        </th>
                        <th scope="col">#</th>
                        <th scope="col">注册名</th>
                        <th scope="col">邮箱</th>
                        <th scope="col">登录方式</th>
                        <th scope="col">联系电话</th>
                        <th scope="col">联系地址</th>
                        <th scope="col">报名时间</th>
                        <th scope="col">状态</th>
                    </TableRow>

                    {activity.userList.map((e, i) => (
                        <TableRow>
                            <th scope="col">
                                <Field type="checkbox" />
                            </th>
                            <th scope="col">{i + 1}</th>
                            <td scope="col">{e.user.name}</td>
                            <td scope="col">{e.user.emails[0].email}</td>
                            <td scope="col">{e.user.provider}</td>
                            <td scope="col">{e.user.profile?.phone}</td>
                            <td scope="col">{e.user.profile?.address}</td>
                            <td scope="col">{e.create_time}</td>
                            <td scope="col" style={{ width: '150px' }}>
                                <FormField
                                    is="select"
                                    onChange={event =>
                                        this.handleStatus(event, e)
                                    }
                                >
                                    <option selected>{status[e.status]}</option>
                                    {status.map((e, i) => (
                                        <option value={i}>{e}</option>
                                    ))}
                                </FormField>
                            </td>
                        </TableRow>
                    ))}
                </Table>
            </PageFrame>
        );
    }
}
