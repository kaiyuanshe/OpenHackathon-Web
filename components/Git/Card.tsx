import { GitTemplate, HackathonBase } from '@kaiyuanshe/openhackathon-service';
import { text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { FC, ReactNode, useContext } from 'react';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';

import { I18nContext } from '../../models/Base/Translation';
import { GitLogo } from './Logo';

export type SimpleRepository = Omit<GitTemplate, Exclude<keyof HackathonBase, 'id'>>;

export interface GitCardProps extends SimpleRepository {
  className?: string;
  renderController?: (item: SimpleRepository) => ReactNode;
}

export const GitCard: FC<GitCardProps> = observer(
  ({
    className = 'shadow-sm',
    languages = [],
    topics = [],
    html_url,
    id,
    description,
    name = html_url?.replace('https://github.com/', ''),
    renderController,
    ...rest
  }) => {
    const { t } = useContext(I18nContext);

    return (
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
            {languages &&
              Object.keys(languages).map(language => (
                <Col key={language} as="li">
                  <GitLogo name={language} />
                </Col>
              ))}
          </Row>
          {description && <Card.Text>{description}</Card.Text>}
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          {html_url && (
            <Button variant="success" target="_blank" href={html_url}>
              {t('home_page')}
            </Button>
          )}
          {renderController?.({
            languages,
            html_url,
            topics,
            id,
            description,
            name,
            ...rest,
          }) || (
            <Form.Check
              className="d-flex align-items-center"
              style={{ gap: '0.5rem' }}
              type="radio"
              id={id + ''}
              name="template"
              value={name}
              label={t('select')}
            />
          )}
        </Card.Footer>
      </Card>
    );
  },
);
