import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScrollList } from 'mobx-restful-table';
import { FC, PureComponent } from 'react';
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
import { i18n } from '../../models/Translation';
import { XScrollListProps } from '../layout/ScrollList';

const { t } = i18n;

export interface TeamWorkListLayoutProps extends XScrollListProps<TeamWork> {
  activity: string;
  team: string;
  size?: 'sm' | 'lg';
  controls?: boolean;
  onDelete?: (id: TeamWork['id']) => any;
}

export const TeamWorkListLayout: FC<TeamWorkListLayoutProps> = ({
  defaultData = [],
  size,
  controls,
  onDelete,
  activity,
  team,
}) => (
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
      {...(size === 'sm' ? {} : !size ? { lg: 3, xxl: 4 } : { lg: 4, xxl: 6 })}
    >
      {defaultData.map(({ id, updatedAt, type, url, title, description }) => (
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
                className="d-block p-2 text-truncate"
                title={t('update_time')}
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
        </Col>
      ))}
    </Row>
  </Container>
);

export class TeamWorkList extends PureComponent<TeamWorkListLayoutProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);

  onDelete = (id?: string) =>
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
