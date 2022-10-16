import { observer } from 'mobx-react';

import Link from 'next/link';
import {
  Ratio,
  Image,
  Row,
  Col,
  Card,
  Accordion,
  Button,
} from 'react-bootstrap';

import { ScrollListProps, ScrollList } from '../ScrollList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';

import { TeamWork, TeamWorkType } from '../../models/Team';
import activityStore from '../../models/Activity';

export interface TeamWorkListProps extends ScrollListProps<TeamWork> {
  activity: string;
  team: string;
  size?: 'sm' | 'lg';
  onSearch?: (id: string) => void;
}

@observer
export class TeamWorkList extends ScrollList<TeamWorkListProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);
  extraProps: any = {
    onDelete: id => {
      this.store.deleteOne(id);
    },
  };
  static Layout = ({
    value = [],
    size,
    onDelete,
    activity,
    team,
  }: TeamWorkListProps) => (
    <Accordion>
      <Link href={`/activity/${activity}/team/${team}/work/create`}>
        <Button variant="success" className="me-3 mb-2">
          提交作品
        </Button>
      </Link>
      <Row
        className="g-4"
        xs={1}
        sm={2}
        {...(size === 'sm'
          ? {}
          : !size
          ? { lg: 3, xxl: 4 }
          : { lg: 4, xxl: 6 })}
      >
        {value.map(({ updatedAt, id, title, description, type, url }) => (
          <Col key={id}>
            <Card className="border-success">
              <Card.Body>
                <Card.Title
                  className="text-primary text-truncate"
                  title={title}
                >
                  <Link
                    href={`/activity/${activity}/team/${team}/work/${id}/edit`}
                  >
                    <a>{title}</a>
                  </Link>
                </Card.Title>
                <Row className="border-bottom py-2 g-4">
                  <span className="text-muted text-truncate">
                    {description}
                  </span>
                </Row>
                <Row className="border-bottom py-2 g-4">
                  {type === TeamWorkType.IMAGE ? (
                    <Image src={url} className="mw-100" alt={title} />
                  ) : type === TeamWorkType.VIDEO ? (
                    <Ratio aspectRatio="16x9">
                      <video controls width="250" src={url} />
                    </Ratio>
                  ) : (
                    <a
                      className="text-primary"
                      target="_blank"
                      href={url}
                      title="查看作品"
                      rel="noreferrer"
                    >
                      查看作品
                    </a>
                  )}
                </Row>
                <Row as="small" className="border-bottom py-2 g-4">
                  <Col className="text-truncate" title="更新时间">
                    <FontAwesomeIcon
                      className="text-success"
                      icon={faCalendarDay}
                    />{' '}
                    {updatedAt}
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Button
                  className="w-100 mt-2"
                  variant="danger"
                  onClick={() => onDelete(id)}
                >
                  删除
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Accordion>
  );
}
