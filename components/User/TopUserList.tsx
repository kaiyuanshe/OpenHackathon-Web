import { Row, Col, Table, Form, Button, Image, Badge } from 'react-bootstrap';
import { TopUser } from '../../models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { faGithub } from '@fortawesome/free-brands-svg-icons';

import styles from '../../styles/TopUserList.module.less';
export interface TopUserListProps {
  value: TopUser[];
}

const parseFn = (str: string) => (str ? JSON.parse(str) : {});
export class TopUserList {
  static Layout = ({ value = [] }: TopUserListProps) => (
    <>
      <Row className={styles.topUserRow}>
        <Col sm={12} xs={12} lg={7}>
          <div className={styles.showTitle}>
            <div className={styles.showMedal}>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <h3>黑客馆</h3>
          </div>
          <ul className={styles.topUserUl}>
            {value.slice(0, 3).map(({ userId, score, rank, user }) => (
              <li key={userId}>
                <div>
                  <div className={styles.imgBox}>
                    <Image
                      className={styles.topUserAvatar}
                      src={user?.photo || parseFn(user?.oAuth)?.avatar_url}
                      alt={
                        user?.nickname ||
                        user?.name ||
                        user?.username ||
                        '神秘黑客'
                      }
                    />
                  </div>
                  <div className={styles.showBox}>
                    <i></i>
                    <span>
                      {user?.nickname ||
                        user?.name ||
                        user?.username ||
                        '神秘黑客'}
                    </span>
                    <strong>{score}</strong>
                    <p>
                      {user?.email && (
                        <a
                          rel="noreferrer"
                          target="_blank"
                          href={'mailto:' + user.email}
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                      )}
                      &nbsp;
                      {parseFn(user?.oAuth)?.html_url && (
                        <a
                          rel="noreferrer"
                          target="_blank"
                          href={parseFn(user?.oAuth)?.html_url}
                        >
                          <FontAwesomeIcon icon={faGithub} />
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Col>
        <Col xs={12} sm={12} lg={5}>
          <Table responsive className={'my-3 ' + styles.topUserList}>
            <tbody>
              {value.slice(3).map(({ userId, score, rank, user }) => (
                <tr key={userId}>
                  <td>
                    <Badge>
                      <i>
                        <strong>
                          {rank < 9 ? '0' : ''}
                          {rank + 1}
                        </strong>
                      </i>
                    </Badge>
                  </td>
                  <td>
                    <a href={user?.profile} className={styles.usernameBox}>
                      <div className={styles.imgBox}>
                        <Image
                          className={styles.topUserAvatar}
                          src={user?.photo || parseFn(user?.oAuth)?.avatar_url}
                          alt={
                            user?.nickname ||
                            user?.name ||
                            user?.username ||
                            '神秘黑客'
                          }
                        />
                      </div>
                      <span
                        style={{
                          color:
                            'rgb(248,' +
                            (rank - 2) * 15 +
                            ',' +
                            (rank - 2) * 35 +
                            ')',
                        }}
                      >
                        {user?.nickname ||
                          user?.name ||
                          user?.username ||
                          '神秘黑客'}
                      </span>
                    </a>
                  </td>
                  <td>
                    <span>{score}</span>
                  </td>
                  <td>
                    {user?.email && (
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href={'mailto:' + user.email}
                      >
                        <FontAwesomeIcon icon={faEnvelope} />
                      </a>
                    )}
                    &nbsp;
                    {parseFn(user?.oAuth)?.html_url && (
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href={parseFn(user?.oAuth)?.html_url}
                      >
                        <FontAwesomeIcon icon={faGithub} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}
