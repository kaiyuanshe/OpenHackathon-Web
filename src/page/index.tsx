import { component, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from 'cell-router/source';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';

import { history } from '../model';
import { HomePage } from './Home';
import { ActivityDetail, ActivityList } from './Activity';
import { UserPage } from './User';
import { TeamPage } from './Team';

@observer
@component({
    tagName: 'page-router',
    renderTarget: 'children'
})
export class PageRouter extends HTMLRouter {
    protected history = history;
    protected routes = [
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
        }
    ];

    menu = [
        {
            title: '首页',
            href: ''
        },
        {
            title: '新手帮助',
            href:
                'https://github.com/kaiyuanshe/open-hackathon/wiki/%E5%BC%80%E6%94%BE%E9%BB%91%E5%AE%A2%E6%9D%BE%E5%B9%B3%E5%8F%B0%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
        }
    ];

    render() {
        return (
            <>
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
                    {this.menu.map(({ title, ...rest }) => (
                        <NavLink {...rest}>{title}</NavLink>
                    ))}
                    <Button href="https://github.com/login/oauth/authorize?client_id=4c42893ddf18f872bfae">
                        登录
                    </Button>
                </NavBar>

                <main style={{ minHeight: '60vh' }}>{super.render()}</main>

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
            </>
        );
    }
}
