import { GitTemplate } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { BadgeBar } from 'mobx-restful-table';
import { FC, ReactNode, useContext } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';

import { I18nContext } from '../../models/Base/Translation';
import { GitLogo } from './Logo';

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

          <BadgeBar
            className="flex-fill"
            list={(topics || []).map(text => ({ text, link: `https://github.com/topics/${text}` }))}
          />
          <Row as="ul" className="list-unstyled g-4" xs={4}>
            {languages.map(language => (
              <Col key={language} as="li">
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
    );
  },
);
