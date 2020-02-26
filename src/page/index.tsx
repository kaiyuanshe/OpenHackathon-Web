import { component, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from 'cell-router/source';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { Button } from 'boot-cell/source/Form/Button';

import { history } from '../model';
import { HomePage } from './Home';

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
        }
    ];

    menu = [
        {
            title: '首页',
            href: ''
        },
        {
            title: '新手帮助',
            href: 'https://github.com/kaiyuanshe/open-hackathon'
        }
    ];

    render() {
        return (
            <Fragment>
                <NavBar
                    narrow
                    brand={
                        <img
                            alt="开放黑客松"
                            src="https://hacking.kaiyuanshe.cn/static/images/logo.jpg"
                            style={{ width: '2rem' }}
                        />
                    }
                    menu={this.menu}
                >
                    <Button href="https://github.com/login/oauth/authorize?client_id=4c42893ddf18f872bfae">
                        登录
                    </Button>
                </NavBar>

                <main
                    className="container my-5 pt-3"
                    style={{ minHeight: '60vh' }}
                >
                    {super.render()}
                </main>

                <footer className="text-center bg-light py-5">
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
            </Fragment>
        );
    }
}
