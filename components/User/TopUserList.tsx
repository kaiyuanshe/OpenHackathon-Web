import { FC } from 'react';
import { Badge, Col, Image, Row, Table } from 'react-bootstrap';
import { parseJSON } from 'web-utility';

import { i18n } from '../../models/Base/Translation';
import { TopUser } from '../../models/User';
import styles from '../../styles/TopUserList.module.less';
import { TopUserAddress } from './TopUserAddress';

const { t } = i18n;

export interface TopUserListProps {
  value: TopUser[];
}

export const TopUserList: FC<TopUserListProps> = ({ value = [] }) => (
  <Row className={styles.topUserRow}>
    <Col sm={12} xs={12} lg={7}>
      <div className={`shadow rounded-3 ${styles.showTitle}`}>
        <div className={styles.showMedal}>
          <i className="d-inline-block ms-1 overflow-hidden rounded-circle" />
          <i className="d-inline-block ms-1 overflow-hidden rounded-circle" />
          <i className="d-inline-block ms-1 overflow-hidden rounded-circle" />
        </div>
        <h3
          data-text={t('hacker_pavilion')}
          className="position-relative m-auto mb-0 fw-bold text-center"
        >
          {t('hacker_pavilion')}
        </h3>
      </div>
      <Row
        as="ul"
        className={`mt-2 g-0 align-items-end text-center ps-0 pt-2 list-unstyled ${styles.topUserUl}`}
      >
        {value.slice(0, 3).map(({ userId, score, user }) => (
          <Col as="li" key={userId}>
            <div
              className={`shadow-lg overflow-hidden rounded-circle m-auto ${styles.imgBox}`}
            >
              <Image
                className="w-100"
                src={user?.photo}
                alt={
                  user?.nickname ||
                  user?.name ||
                  user?.username ||
                  t('mystery_hacker')
                }
              />
            </div>
            <div
              className={`position-relative overflow-hidden ${styles.showBox}`}
            >
              <div className="position-relative">
                <i className="d-block overflow-hidden m-auto mb-1 rounded-circle" />
                <a
                  className="d-block mb-0 stretched-link"
                  href={`/user/${userId}`}
                >
                  {user?.nickname ||
                    user?.name ||
                    user?.username ||
                    t('mystery_hacker')}
                </a>
                <strong>{score}</strong>
              </div>
              <TopUserAddress
                email={user?.email}
                github={parseJSON(user?.oAuth)?.html_url}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Col>
    <Col xs={12} sm={12} lg={5}>
      <Table responsive className={`my-3 pt-2 ${styles.topUserList}`}>
        <tbody>
          {value.slice(3).map(({ userId, score, rank, user }) => (
            <tr key={userId} className="position-relative">
              <td className="align-middle">
                <Badge className="fw-bold fst-italic">
                  {rank < 9 && 0}
                  {rank + 1}
                </Badge>
              </td>
              <td
                className={`position-relative mw-50 text-truncate ${styles.usernameBox}`}
              >
                <div
                  className={`d-inline-block overflow-hidden align-middle rounded-circle ${styles.imgBox}`}
                >
                  <Image
                    className="w-100"
                    src={user?.photo || parseJSON(user?.oAuth)?.avatar_url}
                    alt={
                      user?.nickname ||
                      user?.name ||
                      user?.username ||
                      t('mystery_hacker')
                    }
                  />
                </div>
                <a
                  className="ms-2 d-inline-block align-middle stretched-link"
                  style={{
                    color: `rgb(248, ${(rank - 2) * 15}, ${(rank - 2) * 35})`,
                  }}
                  href={`/user/${userId}`}
                >
                  {user?.nickname ||
                    user?.name ||
                    user?.username ||
                    t('mystery_hacker')}
                </a>
              </td>
              <td className="align-middle">{score}</td>
              <td className="align-middle">
                <TopUserAddress
                  email={user?.email}
                  github={parseJSON(user?.oAuth)?.html_url}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  </Row>
);
