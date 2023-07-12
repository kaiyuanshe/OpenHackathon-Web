import { text2color } from 'idea-react';
import { FC } from 'react';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';

import { GitTemplate } from '../../models/TemplateRepo';
import { i18n } from '../../models/Translation';
import { XScrollListProps } from '../layout/ScrollList';
import { GitLogo } from './Logo';

const { t } = i18n;

export const CardList: FC<XScrollListProps<GitTemplate>> = ({
  defaultData = [],
  selectedIds = [],
  onSelect,
}) => (
  <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
    {defaultData.map(
      ({
        repoLanguages = {},
        repoTopics = [],
        url,
        id,
        description,
        name = url.replace('https://github.com/', ''),
      }) => (
        <Col as="li" key={id}>
          <Card className="shadow-sm">
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

              <Form.Check
                className="d-flex align-items-center gap-2"
                type="checkbox"
                name="template"
                value={name}
                label={t('select')}
                checked={selectedIds.includes(id!)}
                onChange={
                  onSelect &&
                  (({ currentTarget: { checked } }) => {
                    if (checked) return onSelect([...selectedIds, id!]);

                    const index = selectedIds.indexOf(id!);

                    onSelect([
                      ...selectedIds.slice(0, index),
                      ...selectedIds.slice(index + 1),
                    ]);
                  })
                }
              />
            </Card.Footer>
          </Card>
        </Col>
      ),
    )}
  </Row>
);
