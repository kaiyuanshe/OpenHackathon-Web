import { FormEvent, MouseEventHandler, PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { formToJSON } from 'web-utility';
import { Button, Col, Form, Row } from 'react-bootstrap';
import activityStore from '../../models/Activity';
import { TeamWork } from '../../models/Team';
import { NextRouter, withRouter } from 'next/router';
import { FileUpload } from '../FileUpload';
const workTypes = [
  {
    title: '网站',
    value: 'website',
  },
  {
    title: '图片',
    value: 'image',
  },
  {
    title: '视频',
    value: 'video',
  },
  {
    title: 'Word',
    value: 'word',
  },
  {
    title: 'PowerPoint',
    value: 'powerpoint',
  },
  {
    title: 'PDF',
    value: 'pdf',
  },
  {
    title: 'ZIP',
    value: 'zip',
  },
];
class WorkEdit extends PureComponent<{
  work?: TeamWork;
  router: NextRouter | any;
}> {
  store = activityStore
    .teamOf(this.props.router.query.name)
    .workOf(this.props.router.query.tid);
  constructor(props: any) {
    super(props);
    this.state = { work: props.work || { type: 'website' } };
  }
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const data = formToJSON(event.target as HTMLFormElement);
    await this.store.updateOne(data);
    await this.props.router.push(
      `/activity/${this.props.router.query.name}/team/${this.props.router.query.tid}`,
    );
  };
  changeWorkType = (event: FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    this.setState({ work: { ...this.props.work, type: value } });
  };
  render = () => {
    const { work } = this.state as { work: TeamWork };
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
                defaultValue={work.title}
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
                defaultValue={work.description}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="type">
            <Form.Label column sm={2}>
              作品类型
            </Form.Label>
            <Col sm={10}>
              {workTypes.map(typeItem => (
                <Form.Check
                  type="radio"
                  inline
                  label={typeItem.value}
                  name="type"
                  value={typeItem.value}
                  id={typeItem.value}
                  key={typeItem.value}
                  onClick={this.changeWorkType}
                  defaultChecked={work.type === typeItem.value}
                />
              ))}
            </Col>
          </Form.Group>
          {work.type === 'website' && (
            <Form.Group as={Row} className="mb-3" controlId="url">
              <Form.Label column sm={2}>
                作品在线链接
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="url"
                  type="uri"
                  defaultValue={work.url}
                  placeholder="作品链接"
                />
              </Col>
            </Form.Group>
          )}
          {work.type !== 'website' && (
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
                  defaultValue={work.url ? [work.url] : []}
                />
              </Col>
            </Form.Group>
          )}
          <Button variant="primary" type="submit">
            提交
          </Button>
        </Form>
      </Container>
    );
  };
}

export default withRouter(WorkEdit);
