import { GitTemplate } from '@kaiyuanshe/openhackathon-service';
import { text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { FC, ReactNode } from 'react';
import { Badge, Card, Col, Form, Row } from 'react-bootstrap';

import { i18n } from '../../models/Base/Translation';
import { GitLogo } from './Logo';

const { t } = i18n;

export interface GitTeamCardProps extends GitTemplate {
  className?: string;
  renderController?: (item: GitTemplate) => ReactNode;
}

export const GitTeamCard: FC<GitTeamCardProps> = observer(
  ({
    className = 'shadow-sm',
    languages = [],
    topics = [],
    html_url,
    name,
    description,
    renderController,
    ...rest
  }) => (
    <Card className={className}>
      <Card.Body className="d-flex flex-column gap-3">
        <Card.Title as="h3" className="h5">
          <a target="_blank" href={html_url} rel="noreferrer">
            {name}
          </a>
        </Card.Title>

        <nav className="flex-fill">
          {topics?.map(topic => (
            <Badge
              key={topic}
              className="me-1"
              bg={text2color(topic, ['light'])}
              as="a"
              target="_blank"
              href={`https://github.com/topics/${topic}`}
            >
              {topic}
            </Badge>
          ))}
        </nav>
        <Row as="ul" className="list-unstyled g-4" xs={4}>
          {languages.map(language => (
            <Col as="li" key={language}>
              <GitLogo name={language} />
            </Col>
          ))}
        </Row>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        {renderController?.({
          languages,
          html_url,
          topics,
          name,
          description,
          ...rest,
        }) || (
          <Form.Check
            className="d-flex align-items-center"
            style={{ gap: '0.5rem' }}
            type="radio"
            id={name}
            name="template"
            value={name}
            label={t('select')}
          />
        )}
      </Card.Footer>
    </Card>
  ),
);
