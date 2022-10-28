import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react';
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Ratio,
  Row,
} from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { TeamWork, TeamWorkType } from '../../models/Team';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface TeamWorkListProps extends ScrollListProps<TeamWork> {
  activity: string;
  team: string;
  size?: 'sm' | 'lg';
  controls?: boolean;
  onDelete?: (id: TeamWork['id']) => any;
}

@observer
export class TeamWorkList extends ScrollList<TeamWorkListProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);

  extraProps: Partial<TeamWorkListProps> = {
    onDelete: id =>
      id && confirm('确定删除该作品？') && this.store.deleteOne(id),
  };

  static Layout = ({
    value = [],
    size,
    controls,
    onDelete,
    activity,
    team,
  }: TeamWorkListProps) => (
    <Container fluid className="pt-2">
      {controls && (
        <header className="mb-3">
          <Button
            variant="success"
            href={`/activity/${activity}/team/${team}/work/create`}
          >
            提交作品
          </Button>
        </header>
      )}
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
        {value.map(({ id, updatedAt, type, url, title, description }) => (
          <Col key={id}>
            <Card className="border-success">
              <Card.Body>
                <Card.Title
                  as="a"
                  className="text-primary"
                  title={title}
                  target="_blank"
                  href={url}
                >
                  {title || url}
                </Card.Title>
                <p className="border-bottom p-2 text-muted text-truncate">
                  {description}
                </p>
                <div className="border-bottom py-2 my-2">
                  {type === TeamWorkType.IMAGE ? (
                    <Image src={url} className="mw-100" alt={title} />
                  ) : (
                    type === TeamWorkType.VIDEO && (
                      <Ratio aspectRatio="16x9">
                        <video controls width="250" src={url} />
                      </Ratio>
                    )
                  )}
                </div>
                <time
                  className="p-2 text-truncate"
                  title="更新时间"
                  dateTime={updatedAt}
                >
                  <FontAwesomeIcon
                    className="text-success me-2"
                    icon={faCalendarDay}
                  />
                  {new Date(updatedAt).toLocaleString()}
                </time>
              </Card.Body>
              {controls && (
                <Card.Footer className="d-flex">
                  <Button
                    className="flex-fill"
                    variant="warning"
                    href={`/activity/${activity}/team/${team}/work/${id}/edit`}
                  >
                    编辑
                  </Button>
                  <Button
                    className="flex-fill ms-3"
                    variant="danger"
                    onClick={() => onDelete?.(id)}
                  >
                    删除
                  </Button>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
