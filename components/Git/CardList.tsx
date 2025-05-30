import { GitTemplate } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { BadgeBar } from 'mobx-restful-table';
import { FC, useContext } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import { I18nContext } from '../../models/Base/Translation';
import { XScrollListProps } from '../layout/ScrollList';
import { GitLogo } from './Logo';

export const CardList: FC<XScrollListProps<GitTemplate>> = observer(
  ({ defaultData = [], selectedIds = [], onSelect }) => {
    const { t } = useContext(I18nContext);

    return (
      <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
        {defaultData.map(
          ({
            languages = {},
            topics = [],
            html_url,
            id,
            description,
            name = html_url.replace('https://github.com/', ''),
          }) => (
            <Col key={id} as="li">
              <Card className="shadow-sm">
                <Card.Body className="d-flex flex-column gap-3">
                  <Card.Title as="h3" className="h5">
                    <a target="_blank" href={html_url} rel="noreferrer">
                      {name}
                    </a>
                  </Card.Title>

                  <BadgeBar
                    className="flex-fill"
                    list={(topics || []).map(text => ({
                      text,
                      link: `https://github.com/topics/${text}`,
                    }))}
                  />
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

                        onSelect([...selectedIds.slice(0, index), ...selectedIds.slice(index + 1)]);
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
  },
);
