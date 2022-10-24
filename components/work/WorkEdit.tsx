import { observer } from 'mobx-react';
import { FormEvent, PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import activityStore from '../../models/Activity';
import { FileUpload } from '../FileUpload';

const workTypes = [
  { title: '网站', value: 'website' },
  { title: '图片', value: 'image' },
  { title: '视频', value: 'video' },
  { title: 'Word', value: 'word' },
  { title: 'PowerPoint', value: 'powerpoint' },
  { title: 'PDF', value: 'pdf' },
  { title: 'ZIP', value: 'zip' },
];

export interface WorkEditProps {
  name: string;
  tid: string;
  wid?: string;
}

@observer
export class WorkEdit extends PureComponent<WorkEditProps> {
  store = activityStore.teamOf(this.props.name).workOf(this.props.tid);

  componentDidMount() {
    const { wid } = this.props;

    if (wid) this.store.getOne(wid);
  }

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    await this.store.updateOne(formToJSON(event.currentTarget));

    const { name, tid } = this.props;

    location.pathname = `/activity/${name}/team/${tid}`;
  };

  render() {
    const { currentOne } = this.store;

    return (
      <Container>
        <h2 className="text-center">编辑作品</h2>

        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="title">
            <Form.Label column sm={2}>
              名称
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="title"
                type="text"
                placeholder="请填写作品名称"
                pattern="[a-zA-Z0-9]+"
                required
                defaultValue={currentOne?.title}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="description">
            <Form.Label column sm={2}>
              描述
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="description"
                as="textarea"
                rows={3}
                placeholder="请填写作品描述"
                required
                defaultValue={currentOne?.description}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="type">
            <Form.Label column sm={2}>
              作品类型
            </Form.Label>
            <Col sm={10}>
              {workTypes.map(({ value }) => (
                <Form.Check
                  type="radio"
                  inline
                  label={value}
                  name="type"
                  value={value}
                  id={value}
                  key={value}
                  defaultChecked={currentOne?.type === value}
                />
              ))}
            </Col>
          </Form.Group>
          {currentOne?.type === 'website' && (
            <Form.Group as={Row} className="mb-3" controlId="url">
              <Form.Label column sm={2}>
                作品在线链接
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="url"
                  type="uri"
                  defaultValue={currentOne.url}
                  placeholder="作品链接"
                />
              </Col>
            </Form.Group>
          )}
          {currentOne?.type !== 'website' && (
            <Form.Group as={Row} className="mb-3" controlId="url">
              <Form.Label column sm={2}>
                上传作品
              </Form.Label>
              <Col sm={10}>
                <FileUpload
                  accept="video/*,image/*,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  name="url"
                  max={1}
                  required
                  defaultValue={currentOne?.url ? [currentOne.url] : []}
                />
              </Col>
            </Form.Group>
          )}
          <Button className="mb-3" variant="primary" type="submit">
            提交
          </Button>
        </Form>
      </Container>
    );
  }
}
