import {
    WebCellProps,
    VNodeChildElement,
    createCell,
    Fragment
} from 'web-cell';
import { Nav } from 'boot-cell/source/Navigator/Nav';

import { IconNavLinkProps, IconNavLink } from './IconNavLink';
import style from './PageFrame.less';

interface MenuSection {
    title?: VNodeChildElement;
    list: IconNavLinkProps[];
}

export interface PageFrameProps extends WebCellProps {
    menu?: MenuSection[];
}

export function PageFrame({ menu = [], defaultSlot }: PageFrameProps) {
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
                        {list.map(({ title, ...rest }) => (
                            <IconNavLink {...rest}>{title}</IconNavLink>
                        ))}
                    </>
                ))}
            </Nav>
            <main className="flex-fill h-100 p-4 overflow-auto">
                {defaultSlot}
            </main>
        </div>
    );
}
