import { text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { Badge, Card, Col, Form, Row } from 'react-bootstrap';

import { GitModel, GitRepository } from '../../models/Git';
import { GitLogo } from '../GitLogo';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface GitListProps extends ScrollListProps<GitRepository> {
  store: GitModel;
  type: 'host' | 'team';
}

@observer
export class GitList extends ScrollList<GitListProps> {
  store = this.props.store;

  static Layout = ({ type, value = [] }: GitListProps) => (
    <Row as="ul" className="list-unstyled g-4" xs={1} sm={2}>
      {value.map(({ full_name, languages = [], topics = [] }) => (
        <Col as="li" key={full_name}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="flex-fill">{full_name}</Card.Title>

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
            </Card.Body>
            {type === 'team' && (
              <Card.Footer>
                <Form.Check
                  type="radio"
                  id={full_name}
                  name="template"
                  value={full_name}
                  label="使用该模板"
                />
              </Card.Footer>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
}
