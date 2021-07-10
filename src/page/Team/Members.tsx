import {
    WebCellProps,
    component,
    mixin,
    watch,
    attribute,
    createCell
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { BreadCrumb } from 'boot-cell/source/Navigator/BreadCrumb';
import { Table, TableRow } from 'boot-cell/source/Content/Table';
import { Field } from 'boot-cell/source/Form/Field';
import { Button } from 'boot-cell/source/Form/Button';
import { activity, TeamMember, TeamMemberStatus } from '../../model';
import { words } from '../../i18n';

const StatusName = {
    [TeamMemberStatus.none]: words.status_none,
    [TeamMemberStatus.pending]: words.status_pending,
    [TeamMemberStatus.approved]: words.status_approved,
    [TeamMemberStatus.rejected]: words.status_rejected
};

const RoleName = {
    admin: words.admin,
    member: words.member
};

@observer
@component({
    tagName: 'team-members',
    renderTarget: 'children'
})
export class TeamMembers extends mixin() {
    @attribute
    @watch
    activity = '';

    @attribute
    @watch
    tid = '';

    async connectedCallback() {
        this.classList.add('d-block', 'py-4', 'bg-light');

        super.connectedCallback();

        if (this.activity !== activity.current.name)
            await activity.getOne(this.activity);

        if (this.tid && this.tid != activity.team.current.id) {
            await activity.team.getOne(this.tid);
            if (activity.team.members.list.length == 0)
                activity.team.members.getNextPage({}, true);
        }
    }

    handleRole(userId: string) {
        return async ({ target }: Event) => {
            const role = (target as HTMLInputElement).value as TeamMemberStatus;
            const member = activity.team.members.list.find(
                m => m.userId === userId
            );
            if (member && role !== member.role) {
                await activity.team.members.updateRole(userId, role);
                member.role = role;
            }
        };
    }

    handleApprove(userId: string) {
        return async () => {
            const member = activity.team.members.list.find(
                m => m.userId === userId
            );
            await activity.team.members.approveOne(userId);
            member.status = TeamMemberStatus.approved;
        };
    }

    handleDelete(userId: string) {
        return async () => {
            await activity.team.members.deleteOne(userId);
        };
    }

    renderMember = (
        {
            userId,
            user: { nickname, email, phone },
            status,
            description,
            role
        }: TeamMember,
        i: number
    ) => (
        <TableRow checked={false}>
            <td>{i + 1}</td>
            <td>{nickname}</td>
            <td>{email}</td>
            <td>{phone}</td>
            <td>{description}</td>
            <td>
                <Field is="select" onChange={this.handleRole(userId)}>
                    {Object.entries(RoleName).map(([value, name]) => (
                        <option value={value} selected={role === value}>
                            {name}
                        </option>
                    ))}
                </Field>
            </td>
            <td>
                {StatusName[status]}
                {status === TeamMemberStatus.pending ? (
                    <Button onClick={this.handleApprove(userId)} color="link">
                        {words.approve}
                    </Button>
                ) : (
                    ''
                )}
            </td>
            <td>
                <Button color="danger" onClick={this.handleDelete(userId)}>
                    删除
                </Button>
            </td>
        </TableRow>
    );

    render() {
        const loading = activity.loading || activity.team.loading;
        const { displayName: hackathonDisplayName } = activity.current;
        const { displayName: teamName } = activity.team.current;
        const { list } = activity.team.members;
        return (
            <SpinnerBox className="container" cover={loading}>
                <BreadCrumb
                    path={[
                        {
                            title: hackathonDisplayName,
                            href: 'activity?name=' + this.activity
                        },
                        {
                            title: teamName,
                            href:
                                'team?activity=' +
                                this.activity +
                                '&tid=' +
                                this.tid
                        },
                        {
                            title: words.team_members
                        }
                    ]}
                />
                <Table className="mt-2" small center>
                    <TableRow type="head" checked={false}>
                        <th>#</th>
                        <th>昵称</th>
                        <th>邮箱</th>
                        <th>联系电话</th>
                        <th>个人简介</th>
                        <th>角色</th>
                        <th>状态</th>
                        <th>操作</th>
                    </TableRow>

                    {list.map(this.renderMember)}
                </Table>
            </SpinnerBox>
        );
    }
}
