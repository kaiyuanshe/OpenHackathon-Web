import { createCell } from 'web-cell';
import { NavLinkProps, NavLink } from 'boot-cell/source/Navigator/Nav';
import { FAIcon } from 'boot-cell/source/Reminder/FAIcon';

export interface IconNavLinkProps extends NavLinkProps {
    icon: string;
}

export function IconNavLink({ icon, defaultSlot, ...rest }: IconNavLinkProps) {
    return (
        <NavLink {...rest}>
            <FAIcon
                name={icon}
                className="text-center mr-md-2"
                style={{
                    width: '1.25rem',
                    height: '1.25rem'
                }}
            />
            <span className="d-none d-md-inline">{defaultSlot}</span>
        </NavLink>
    );
}
