import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { textJoin } from 'web-utility/source/i18n';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { BreadCrumb } from 'boot-cell/source/Navigator/BreadCrumb';
import { BGIcon } from 'boot-cell/source/Reminder/FAIcon';
import { Button } from 'boot-cell/source/Form/Button';

import { words } from '../../i18n';
import { activity } from '../../model';

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
    members = [];

    async connectedCallback() {
        this.classList.add('d-block', 'py-4', 'bg-light');

        super.connectedCallback();

        if (this.activity !== activity.current.name)
            await activity.getOne(this.activity);

        if (this.tid) {
            await activity.team.getOne(this.tid);
            activity.team.members.boot(activity.current.name, activity.team.current.id);
            this.members = await activity.team.members.getNextPage({}, true);
        }
    }

    render() {
        const { displayName: hackathonDisplayName, name: hackathonName } = activity.current;
        const {
            id,
            logo,
            displayName,
            description
        } = (activity.team && activity.team.current) || {}
        const loading = activity.loading || (activity.team && activity.team.loading);

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
                            <Button
                                href={`team/edit?activity=${hackathonName}&tid=${id}`}
                                color="link"
                            >
                                {textJoin(
                                    words.edit,
                                    words.team,
                                    words.profile
                                )}
                            </Button>
                        </header>
                        <div className="p-3 border-top">
                            <BGIcon type="square" name="users" />
                            {words.team_members}
                            <ul className="list-unstyled mt-3">
                                {this.members?.map(
                                    ({
                                        user: { id, photo, nickname }
                                    }) => (
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
                        </div>
                    </div>
                </div>
            </SpinnerBox>
        );
    }
}
