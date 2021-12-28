import { component, mixin, createCell, Fragment } from 'web-cell';
import { Route, CellRouter } from 'cell-router/source';
import { observer } from 'mobx-web-cell';
import { textJoin } from 'web-utility/source/i18n';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu, DropMenuItem } from 'boot-cell/source/Navigator/DropMenu';

import logo from '../image/logo.png';
import { words } from '../i18n';
import { history, session, User } from '../model';
import { HomePage } from './Home';
import { ActivityDetail, ActivityList } from './Activity';
import { UserDetail } from './User/Detail';
import { TeamDetail } from './Team';

interface PageRouterState {
    loading: boolean;
}

@observer
@component({
    tagName: 'page-router',
    renderTarget: 'children'
})
export class PageRouter extends mixin<{}, PageRouterState>() {
    state = { loading: false };

    routes: Route[] = [
        {
            paths: [''],
            component: HomePage
        },
        {
            paths: ['activity'],
            component: ActivityDetail
        },
        {
            paths: ['activity/list'],
            component: ActivityList
        },
        {
            paths: ['activity/register'],
            component: async () => {
                const { user } = session;
                if (!user) await this.signIn();
                return (await import('./Activity/Register')).RegisterPage;
            }
        },
        {
            paths: ['user'],
            component: UserDetail
        },
        {
            paths: ['user/edit'],
            component: async () => (await import('./User/Edit')).UserEdit
        },
        {
            paths: ['team'],
            component: TeamDetail
        },
        {
            paths: ['team/edit'],
            component: async () => (await import('./Team/Edit')).TeamEdit
        },
        {
            paths: ['team/members'],
            component: async () => (await import('./Team/Members')).TeamMembers
        },
        {
            paths: ['create'],
            component: async () =>
                (await import('./Activity/Manage/Creator')).CreateActivity
        },
        {
            paths: ['manage/activity'],
            component: async () =>
                (await import('./Activity/Manage/Editor')).EditActivity
        },
        {
            paths: ['manage/award'],
            component: async () =>
                (await import('./Activity/Manage/Award')).ManageAward
        },
        {
            paths: ['manage/participant'],
            component: async () =>
                (await import('./Activity/Manage/Participant'))
                    .ManageParticipant
        },
        {
            paths: ['admin'],
            component: async () => (await import('./Admin')).AdminPage
        }
    ];

    menu = [
        {
            title: words.hackathons,
            href: 'activity/list'
        },
        {
            title: words.get_started,
            href: 'https://github.com/kaiyuanshe/open-hackathon/wiki/%E5%BC%80%E6%94%BE%E9%BB%91%E5%AE%A2%E6%9D%BE%E5%B9%B3%E5%8F%B0%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
        }
    ];

    signIn = async () => {
        this.setState({ loading: true });

        const { AuthingGuard } = await import(
            '@authing/native-js-ui-components'
        );
        this.setState({ loading: false });

        const dialog = new AuthingGuard('60178760106d5f26cb267ac1', {
            target: '#sign-in',
            title: document.title,
            logo
        });
        const data = await new Promise<Partial<User>>(resolve =>
            // @ts-ignore
            dialog.on('login', resolve)
        );
        data.nickname ||= data.username || data.email || data.phone;

        await session.signIn(data);

        document.querySelector('#sign-in').innerHTML = '';
    };

    renderUserBar({ nickname, id }: User) {
        return (
            <>
                <Button className="mr-3" color="success" href="create">
                    {textJoin(words.create, words.hackathons)}
                </Button>
                <DropMenu buttonColor="primary" caption={nickname}>
                    <DropMenuItem href={'user?uid=' + id}>
                        {textJoin(words.user, words.profile)}
                    </DropMenuItem>
                    <DropMenuItem onClick={() => session.signOut()}>
                        {words.sign_out}
                    </DropMenuItem>
                </DropMenu>
            </>
        );
    }

    render(_, { loading }: PageRouterState) {
        const { menu, routes } = this,
            { user } = session;

        return (
            <SpinnerBox cover={loading}>
                <NavBar
                    narrow
                    expand="md"
                    fixed="top"
                    theme="dark"
                    background="dark"
                    brand={
                        <img
                            alt={words.open_hackathon_platform}
                            src="https://hackathon-api.static.kaiyuanshe.cn/static/logo.jpg"
                            style={{ width: '2rem' }}
                        />
                    }
                >
                    {menu.map(({ title, ...rest }) => (
                        <NavLink {...rest}>{title}</NavLink>
                    ))}
                    {!user ? (
                        <Button color="primary" onClick={this.signIn}>
                            {words.sign_in}
                        </Button>
                    ) : (
                        this.renderUserBar(user)
                    )}
                </NavBar>

                <CellRouter
                    style={{ minHeight: '60vh' }}
                    history={history}
                    routes={routes}
                />
                <footer className="bg-dark text-white text-center py-5">
                    {words.proudly_developed_with}
                    <a
                        className="mx-1"
                        target="_blank"
                        href="https://web-cell.dev/"
                    >
                        WebCell v2
                    </a>
                    &amp;
                    <a
                        className="mx-1"
                        target="_blank"
                        href="https://web-cell.dev/BootCell/"
                    >
                        BootCell v1
                    </a>
                </footer>
            </SpinnerBox>
        );
    }
}
