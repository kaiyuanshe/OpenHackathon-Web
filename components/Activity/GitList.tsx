import { text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { ReactNode } from 'react';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';

import { GitModel, GitRepository } from '../../models/Git';
import { GitLogo } from '../GitLogo';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface GitListProps extends ScrollListProps<GitRepository> {
  store: GitModel;
  renderController?: (item: GitRepository) => ReactNode;
}

@observer
export class GitList extends ScrollList<GitListProps> {
  store = this.props.store;

  static Layout = ({ value = [], renderController }: GitListProps) => (
    <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
      {value.map(
        ({
          full_name,
          html_url,
          languages = [],
          topics = [],
          description,
          homepage,
          ...rest
        }) => (
          <Col as="li" key={full_name}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h3" className="h5 flex-fill">
                  <a target="_blank" href={html_url} rel="noreferrer">
                    {full_name}
                  </a>
                </Card.Title>

                <ul className="list-inline mb-3">
                  {topics.map(topic => (
                    <Badge
                      key={topic}
                      as="li"
                      className="list-inline-item"
                      bg={text2color(topic, ['light'])}
                    >
                      {topic}
                    </Badge>
                  ))}
                </ul>
                <Row as="ul" className="list-unstyled g-4" xs={4}>
                  {languages.map(language => (
                    <Col as="li" key={language}>
                      <GitLogo name={language} />
                    </Col>
                  ))}
                </Row>
                <Card.Text className="mt-2">{description}</Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                {homepage && (
                  <Button variant="success" target="_blank" href={homepage}>
                    访问预览
                  </Button>
                )}
                {renderController?.({
                  full_name,
                  html_url,
                  languages,
                  topics,
                  description,
                  homepage,
                  ...rest,
                }) || (
                  <Form.Check
                    type="radio"
                    id={full_name}
                    name="template"
                    value={full_name}
                    label="选择"
                  />
                )}
              </Card.Footer>
            </Card>
          </Col>
        ),
      )}
    </Row>
  );
}
