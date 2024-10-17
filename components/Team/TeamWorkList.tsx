import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TeamWork } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { FilePreview, ScrollList } from 'mobx-restful-table';
import { FC, PureComponent } from 'react';
import { Button, Card, CardProps, Col, Container, Row } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import activityStore from '../../models/Activity';
import { i18n, t } from '../../models/Base/Translation';
import { XScrollListProps } from '../layout/ScrollList';

export interface TeamWorkCardProps
  extends TeamWork,
    Omit<CardProps, 'id' | 'title'> {
  controls?: boolean;
  onDelete?: (id: TeamWork['id']) => any;
}

export const TeamWorkCard: FC<TeamWorkCardProps> = observer(
  ({
    className = '',
    id,
    type,
    updatedAt,
    title,
    url,
    description,
    hackathon: { name },
    team: { id: teamId },
    controls,
    onDelete,
    ...props
  }) => (
    <Card className={`border-success ${className}`} {...props}>
      <Card.Body className="d-flex flex-column">
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
        <div className="border-bottom py-2 my-2 flex-fill">
          <FilePreview className="w-100" type={type} path={url} />
        </div>
        <time
          className="d-block p-2 text-truncate"
          title={t('update_time')}
          dateTime={updatedAt}
        >
          <FontAwesomeIcon className="text-success me-2" icon={faCalendarDay} />
          {formatDate(updatedAt)}
        </time>
      </Card.Body>
      {controls && (
        <Card.Footer className="d-flex">
          <Button
            className="flex-fill"
            variant="warning"
            href={`/activity/${name}/team/${teamId}/work/${id}/edit`}
          >
            {t('edit')}
          </Button>
          <Button
            className="flex-fill ms-3"
            variant="danger"
            onClick={() => onDelete?.(id)}
          >
            {t('delete')}
          </Button>
        </Card.Footer>
      )}
    </Card>
  ),
);

export interface TeamWorkListLayoutProps
  extends XScrollListProps<TeamWork>,
    Pick<TeamWorkCardProps, 'controls' | 'onDelete'> {
  activity: string;
  team: number;
  size?: 'sm' | 'lg';
}

export const TeamWorkListLayout: FC<TeamWorkListLayoutProps> = observer(
  ({ defaultData = [], size, controls, onDelete, activity, team }) => (
    <Container fluid className="pt-2">
      {controls && (
        <header className="mb-3">
          <Button
            variant="success"
            href={`/activity/${activity}/team/${team}/work/create`}
          >
            {t('submit_work')}
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
        {defaultData.map(work => (
          <Col key={work.id}>
            <TeamWorkCard
              className="h-100"
              {...work}
              {...{ controls, onDelete }}
            />
          </Col>
        ))}
      </Row>
    </Container>
  ),
);

export class TeamWorkList extends PureComponent<TeamWorkListLayoutProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);

  onDelete = (id?: number) =>
    id && confirm(t('confirm_delete_work')) && this.store.deleteOne(id);

  render() {
    const { props } = this;

    return (
      <ScrollList
        translator={i18n}
        store={this.store}
        renderList={allItems => (
          <TeamWorkListLayout
            {...props}
            defaultData={allItems}
            onDelete={this.onDelete}
          />
        )}
      />
    );
  }
}
