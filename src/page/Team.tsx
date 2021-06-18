import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { BreadCrumb } from 'boot-cell/source/Navigator/BreadCrumb';
import { BGIcon } from 'boot-cell/source/Reminder/FAIcon';

import { team, activity } from '../model';

@observer
@component({
    tagName: 'team-page',
    renderTarget: 'children'
})
export class TeamPage extends mixin() {
    @attribute
    @watch
    activity = '';

    @attribute
    @watch
    tid = '';

    connectedCallback() {
        this.classList.add('d-block', 'py-4', 'bg-light');

        if (this.activity !== activity.current.name)
            activity.getOne(this.activity);

        team.getOne(this.activity, this.tid);

        super.connectedCallback();
    }

    render() {
        const { displayName, name: hackathon } = activity.current;
        const { logo, name, members, project_name, cover } = team.current;
        const loading = activity.loading || team.loading;

        return (
            <SpinnerBox className="container" cover={loading}>
                <BreadCrumb
                    path={[
                        {
                            title: displayName,
                            href: 'activity?name=' + hackathon
                        },
                        { title: name }
                    ]}
                />
                <div className="d-lg-flex">
                    <div className="border bg-white mr-lg-3 mb-3 mb-lg-0">
                        <header className="p-3">
                            <img className="d-block m-auto" src={logo} />
                            <h2>{name}</h2>
                        </header>
                        <div className="p-3 border-top">
                            <BGIcon type="square" name="users" />
                            团队成员
                            <ul className="list-unstyled mt-3">
                                {members?.map(
                                    ({
                                        user: { id, avatar_url, nickname }
                                    }) => (
                                        <li>
                                            <a href={'user?uid=' + id}>
                                                <img
                                                    style={{ width: '1.5rem' }}
                                                    src={avatar_url}
                                                />{' '}
                                                {nickname}
                                            </a>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="border bg-white flex-fill">
                        <div className="p-3">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>项目名称</th>
                                        <td>{project_name}</td>
                                    </tr>
                                    <tr>
                                        <th>项目封面图</th>
                                        <td>{cover}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </SpinnerBox>
        );
    }
}
