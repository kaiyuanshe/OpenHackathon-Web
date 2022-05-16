import { PropsWithChildren, Fragment } from 'react';
import Link from 'next/link';
import { Nav, Breadcrumb, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faUser,
  faUserSecret,
  faTrophy,
  faStar,
  faSitemap,
  faBullhorn,
  faUpload,
  faThLarge,
  faDesktop,
} from '@fortawesome/free-solid-svg-icons';

import { findDeep } from '../utils/data';
import { menus } from '../models/ActivityManage';
import { MenuItem } from '../models/ActivityManage';

library.add(
  faEdit,
  faUser,
  faUserSecret,
  faTrophy,
  faStar,
  faSitemap,
  faBullhorn,
  faUpload,
  faThLarge,
  faDesktop,
);

export type ActivityManageFrameProps = PropsWithChildren<{
  name: string;
  path?: string;
  menu?: MenuItem[];
}>;

export function ActivityManageFrame({
  name,
  menu = menus,
  path = '',
  children,
}: ActivityManageFrameProps) {
  const route = findDeep(menus, 'list', ({ href }) => {
    console.log(href, path);
    return !!href && path.includes(href);
  });

  return (
    <Row xs={1} md={2}>
      <Col md="auto">
        <Nav className="flex-column px-2 border-end" variant="pills">
          {menu.map(({ title, list }) => (
            <Fragment key={title}>
              <Nav.Link className="text-muted d-md-none d-lg-inline" disabled>
                {title}
              </Nav.Link>
              {list?.map(({ title, href, icon = 'home' }) => (
                <Link
                  key={title}
                  href={`/activity/${name}/manage/${href}`}
                  passHref
                >
                  <Nav.Link>
                    <FontAwesomeIcon
                      icon={icon}
                      className="text-primary ms-3 me-3"
                    />
                    <span className="d-md-none d-lg-inline">{title}</span>
                  </Nav.Link>
                </Link>
              ))}
            </Fragment>
          ))}
        </Nav>
      </Col>

      <Col className="flex-fill  me-4">
        <Breadcrumb className="p-1 bg-light rounded">
          {route.map(({ href, title }, index, { length }) => (
            <Breadcrumb.Item
              className="mt-3"
              key={href}
              href={href}
              active={index + 1 === length}
            >
              {title}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <section className="mt-3">{children}</section>
      </Col>
    </Row>
  );
}
