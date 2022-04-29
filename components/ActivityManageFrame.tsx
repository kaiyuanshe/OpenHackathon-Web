import React, { PropsWithChildren } from 'react';
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
import { menus } from '../models/ActivityManage';
import { MenuList } from '../models/ActivityManage';
//这样添加合适吗？目前找到的可以遍历生产icon的方法
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
  menu?: MenuList[];
  path?: string;
}>;

export function ActivityManageFrame({
  menu = menus,
  path,
  children,
}: ActivityManageFrameProps) {
  let innerIndex = -1;
  const current = menu.find(({ list }) =>
    list.find(({ href }, index) => {
      if (path?.split('/')[4].includes(href)) {
        innerIndex = index;
        return true;
      }
    }),
  );
  return (
    <Row xs={1} md={2}>
      <Col md="auto">
        <Nav className="flex-column px-2 border-end">
          {menu.map(({ title, list }) => (
            <>
              <Nav.Link className="text-muted" disabled>
                {title}
              </Nav.Link>
              {list.map(({ title, href, icon }) => (
                <Link key={title} href={href} passHref>
                  <Nav.Link>
                    <FontAwesomeIcon
                      icon={icon}
                      className="text-primary ms-3 me-3"
                    />
                    {title}
                  </Nav.Link>
                </Link>
              ))}
            </>
          ))}
        </Nav>
      </Col>

      <Col className="flex-fill">
        <Breadcrumb className="p-1 bg-light rounded">
          <Breadcrumb.Item className="mt-3 ps-3">
            {current?.title}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            className="mt-3"
            href={current?.list[innerIndex]?.href}
            active
          >
            {current?.list[innerIndex]?.title}
          </Breadcrumb.Item>
        </Breadcrumb>
        <section className="mt-2">{children}</section>
      </Col>
    </Row>
  );
}
