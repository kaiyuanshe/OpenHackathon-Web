import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { textJoin } from 'web-utility/source/i18n';
import { formToJSON } from 'web-utility/source/DOM';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { BreadCrumb } from 'boot-cell/source/Navigator/BreadCrumb';
import { BGIcon } from 'boot-cell/source/Reminder/FAIcon';
import { Button } from 'boot-cell/source/Form/Button';
import { Form } from 'boot-cell/source/Form/Form';
import { FormField } from 'boot-cell/source/Form/FormField';

import { words } from '../../i18n';
import { activity, session, TeamMember } from '../../model';
import { buildURLData } from 'web-utility';

@observer
@component({
    tagName: 'team-detail',
    renderTarget: 'children'
})
export class TeamDetail extends mixin() {
    @attribute
    @watch
    activity = '';

    @attribute
    @watch
    tid = '';

    @watch
    joining_team_form = false;

    async connectedCallback() {
        this.classList.add('d-block', 'py-4', 'bg-light');

        super.connectedCallback();

        if (this.activity !== activity.current.name)
            await activity.getOne(this.activity);

        if (!this.tid) return;

        await activity.team.getOne(this.tid);
        await activity.team.members.getNextPage({}, true);

        const { user } = session;
        if (!user) return;
        try {
            await activity.team.members.getOne(user.id);
        } catch (err) {
            if (err.status !== 404)
                //404: user is not a memeber of team
                throw err;
        }
    }

    async joinTeam(event: Event) {
        event.preventDefault(), event.stopPropagation();

        const form = event.target as HTMLFormElement;
        const data = formToJSON<TeamMember>(form);
        data.role = 'member';
        const me = await activity.team.members.updateOne(data);
        activity.team.members.current = me;
        if (me.status === 'approved') activity.team.members.list.push(me);
    }

    async leaveTeam() {
        await activity.team.members.leave();
        await activity.team.members.getNextPage({}, true);
    }

    renderJoiningTeam() {
        return this.joining_team_form ? (
            <Form onSubmit={this.joinTeam}>
                <FormField
                    label={textJoin(words.personal, words.introduction)}
                    name="description"
                    placeholder={words.team_member_description_tips}
                    required
                />
                <Button
                    type="submit"
                    color="primary"
                    onClick={() => (this.joining_team_form = false)}
                >
                    {words.submit}
                </Button>
                &nbsp;
                <Button
                    color="secondary"
                    onClick={() => (this.joining_team_form = false)}
                >
                    {words.cancel}
                </Button>
            </Form>
        ) : (
            <Button
                color="success"
                onClick={() => (this.joining_team_form = true)}
            >
                {words.join_team}
            </Button>
        );
    }

    renderLeavingTeam({ role, status }) {
        const { activity, tid } = this;
        return status === 'approved' ? (
            role === 'admin' ? (
                <Button
                    color="link"
                    href={
                        'team/members?' +
                        buildURLData({
                            activity,
                            tid
                        })
                    }
                >
                    {words.manage_team_members}
                </Button>
            ) : (
                <Button color="danger" onClick={this.leaveTeam}>
                    {words.leave_team}
                </Button>
            )
        ) : status === 'pendingApproval' ? (
            <div>
                <p>{words.waiting_approval_from_team_admin}</p>
                <Button color="danger" onClick={this.leaveTeam}>
                    {words.cancel_joining}
                </Button>
            </div>
        ) : (
            ''
        );
    }

    render() {
        const { displayName: hackathonDisplayName, name: hackathonName } =
            activity.current;
        const { id, logo, displayName, description } = activity.team.current;
        const members = activity.team.members;
        const loading = activity.loading || activity.team.loading;
        const { user } = session;

        return (
            <SpinnerBox className="container" cover={loading}>
                <BreadCrumb
                    path={[
                        {
                            title: hackathonDisplayName,
                            href: 'activity?name=' + hackathonName
                        },
                        { title: displayName }
                    ]}
                />
                <div className="d-lg-flex">
                    <div className="border bg-white mr-lg-3 mb-3 mb-lg-0">
                        <header className="p-3">
                            <img className="d-block m-auto" src={logo} />
                            <h2>{displayName}</h2>
                            <p>{description}</p>
                            {members.current.role === 'admin' ? (
                                <Button
                                    href={
                                        'team/edit?' +
                                        buildURLData({
                                            activity: hackathonName,
                                            tid: id
                                        })
                                    }
                                    color="link"
                                >
                                    {textJoin(
                                        words.edit,
                                        words.team,
                                        words.profile
                                    )}
                                </Button>
                            ) : (
                                ''
                            )}
                        </header>
                        <div className="p-3 border-top">
                            <BGIcon type="square" name="users" />
                            {words.team_members}
                            <ul className="list-unstyled mt-3">
                                {members.list.map(
                                    ({ user: { id, photo, nickname } }) => (
                                        <li>
                                            <a href={'user?uid=' + id}>
                                                <img
                                                    style={{ width: '1.5rem' }}
                                                    src={photo}
                                                />{' '}
                                                {nickname}
                                            </a>
                                        </li>
                                    )
                                )}
                            </ul>
                            {user &&
                                (members.current.role
                                    ? this.renderLeavingTeam(members.current)
                                    : this.renderJoiningTeam())}
                        </div>
                    </div>
                </div>
            </SpinnerBox>
        );
    }
}
