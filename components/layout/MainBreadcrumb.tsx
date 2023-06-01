import { FC } from 'react';
import { Breadcrumb } from 'react-bootstrap';

import { MenuItem } from '../../configuration/menu';

export interface MainBreadcrumbProps {
  currentRoute: MenuItem[];
}

export const MainBreadcrumb: FC<MainBreadcrumbProps> = ({ currentRoute }) => (
  <Breadcrumb className="p-1 bg-light rounded">
    {currentRoute.map(({ href, title }, index, { length }) => (
      <Breadcrumb.Item
        className="mt-3"
        key={title}
        href={href}
        active={index + 1 === length}
      >
        {title}
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
);
