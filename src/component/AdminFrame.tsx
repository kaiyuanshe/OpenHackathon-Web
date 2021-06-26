import {
    WebCellProps,
    VNodeChildElement,
    createCell,
    Fragment
} from 'web-cell';
import { parseURLData, buildURLData } from 'web-utility/source/URL';
import { Nav } from 'boot-cell/source/Navigator/Nav';
import { BreadCrumb } from 'boot-cell/source/Navigator/BreadCrumb';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';

import { IconNavLinkProps, IconNavLink } from './IconNavLink';
import style from './AdminFrame.module.less';
import { history } from '../model';

interface MenuSection {
    title?: VNodeChildElement;
    list: IconNavLinkProps[];
}

export interface AdminFrameProps extends WebCellProps {
    menu: MenuSection[];
    name: string;
    loading?: boolean;
}

export function AdminFrame({
    menu,
    name,
    loading,
    defaultSlot
}: AdminFrameProps) {
    var innerIndex = -1;
    const current = menu.find(({ list }) =>
        list.find(({ href }, index) => {
            if (history.path.includes(href)) {
                innerIndex = index;
                return true;
            }
        })
    );
    return (
        <div className={style.body}>
            <Nav direction="column" className="py-2 bg-light border-right">
                {menu.map(({ title, list }) => (
                    <>
                        {title && (
                            <h6 className="text-muted mx-3 mt-4 d-none d-md-block">
                                {title}
                            </h6>
                        )}
                        {list.map(({ href, title, ...rest }) => (
                            <IconNavLink
                                {...rest}
                                href={`${href.split('?')[0]}?${buildURLData({
                                    ...parseURLData(href),
                                    name
                                })}`}
                            >
                                {title}
                            </IconNavLink>
                        ))}
                    </>
                ))}
            </Nav>
            <main className="flex-fill p-4">
                <BreadCrumb
                    path={[
                        { title: current?.title },
                        { title: current?.list[innerIndex]?.title }
                    ]}
                />
                <SpinnerBox cover={loading}>{defaultSlot}</SpinnerBox>
            </main>
        </div>
    );
}
