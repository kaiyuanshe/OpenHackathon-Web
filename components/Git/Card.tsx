import { text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { FC, ReactNode } from 'react';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';

import { i18n } from '../../models/Base/Translation';
import { GitTemplate } from '../../models/TemplateRepo';
import { GitLogo } from './Logo';

const { t } = i18n;

export interface GitCardProps extends GitTemplate {
  className?: string;
  renderController?: (item: GitTemplate) => ReactNode;
}

export const GitCard: FC<GitCardProps> = observer(
  ({
    className = 'shadow-sm',
    repoLanguages = {},
    repoTopics = [],
    url,
    id,
    description,
    name = url?.replace('https://github.com/', ''),
    renderController,
    ...rest
  }) => (
    <Card className={className}>
      <Card.Body className="d-flex flex-column gap-3">
        <Card.Title as="h3" className="h5">
          <a target="_blank" href={url} rel="noreferrer">
            {name}
          </a>
        </Card.Title>

        <nav className="flex-fill">
          {repoTopics?.map(topic => (
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
          {repoLanguages &&
            Object.keys(repoLanguages).map(language => (
              <Col as="li" key={language}>
                <GitLogo name={language} />
              </Col>
            ))}
        </Row>
        {description && <Card.Text>{description}</Card.Text>}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        {url && (
          <Button variant="success" target="_blank" href={url}>
            {t('home_page')}
          </Button>
        )}
        {renderController?.({
          repoLanguages,
          url,
          repoTopics,
          id,
          ...rest,
        }) || (
          <Form.Check
            className="d-flex align-items-center"
            style={{ gap: '0.5rem' }}
            type="radio"
            id={id}
            name="template"
            value={name}
            label={t('select')}
          />
        )}
      </Card.Footer>
    </Card>
  ),
);
