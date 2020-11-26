import { component, mixin, createCell } from 'web-cell';
import { CellRouter } from 'cell-router/source';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu, DropMenuItem } from 'boot-cell/source/Navigator/DropMenu';

import { importJS } from '../utility';
import logo from '../image/logo.png';
import { history, session } from '../model';
import { HomePage } from './Home';
import { ActivityDetail, ActivityList, ManagerOverview } from './Activity';
import { UserPage } from './User';
import { TeamPage } from './Team';

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

    routes = [
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
            paths: ['user'],
            component: UserPage
        },
        {
            paths: ['team'],
            component: TeamPage
        },
        {
            paths: ['create'],
            component: async () =>
                (await import('./Activity/CreateActivity')).CreateActivity
        },
        {
            paths: ['manage'],
            component: ManagerOverview
        }
    ];

    menu = [
        {
            title: '黑客松活动',
            href: 'activity/list'
        },
        {
            title: '新手帮助',
            href:
                'https://github.com/kaiyuanshe/open-hackathon/wiki/%E5%BC%80%E6%94%BE%E9%BB%91%E5%AE%A2%E6%9D%BE%E5%B9%B3%E5%8F%B0%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
        }
    ];

    signIn = async () => {
        this.setState({ loading: true });
        await importJS(
            'https://cdn.jsdelivr.net/npm/@authing/guard@1.16.4/dist/Guard.umd.min.js'
        );
        this.setState({ loading: false });
        // @ts-ignore
        const dialog = new self.Guard('5f0e628e4ba608e9a69533ae', {
            mountId: 'sign-in',
            title: document.title,
            logo
        });
        const { data } = await new Promise(resolve =>
            dialog.on('login', resolve)
        );
        await session.signIn(data);

        dialog.hide();
    };

    render(_, { loading }: PageRouterState) {
        const { menu, routes } = this;

        return (
            <SpinnerBox cover={loading}>
                <NavBar
                    narrow
                    brand={
                        <img
                            alt="开放黑客松"
                            src="https://hacking.kaiyuanshe.cn/static/images/logo.jpg"
                            style={{ width: '2rem' }}
                        />
                    }
                >
                    {menu.map(({ title, ...rest }) => (
                        <NavLink {...rest}>{title}</NavLink>
                    ))}
                    {!session.user ? (
                        <Button onClick={this.signIn}>登录</Button>
                    ) : (
                        <DropMenu caption={session.user.nickname}>
                            <DropMenuItem href="manage">个人主页</DropMenuItem>
                            <DropMenuItem onClick={() => session.signOut()}>
                                退出
                            </DropMenuItem>
                        </DropMenu>
                    )}
                </NavBar>

                <CellRouter
                    style={{ minHeight: '60vh' }}
                    history={history}
                    routes={routes}
                />
                <footer className="bg-dark text-white text-center py-5">
                    Proudly developed with
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
