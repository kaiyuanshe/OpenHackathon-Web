import { FormEvent, PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { observable } from 'mobx';
import { formToJSON } from 'web-utility';
import { Button, Col, Form, Row } from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { TeamWork } from '../../models/Team';
import { NextRouter, withRouter } from 'next/router';
import { FileUpload } from '../FileUpload';
import { TeamWorkType } from '../../models/Team';
const workTypes = [
  { title: '网站', value: 'website' },
  { title: '图片', value: 'image' },
  { title: '视频', value: 'video' },
  { title: 'Word', value: 'word' },
  { title: 'PowerPoint', value: 'powerpoint' },
  { title: 'PDF', value: 'pdf' },
  { title: 'ZIP', value: 'zip' },
];
//TODO 当前表单组件用类组件的形式
class WorkEdit extends PureComponent<{
  work?: TeamWork;
  router: NextRouter | any;
}> {
  store = activityStore
    .teamOf(this.props.router.query.name)
    .workOf(this.props.router.query.tid);

  @observable
  work: Partial<TeamWork> =
    this.props.work || ({ type: TeamWorkType.WEBSITE } as TeamWork);
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const data = formToJSON(event.target as HTMLFormElement);
    await this.store.updateOne(data);
    const { router } = this.props;
    await router.push(
      `/activity/${router.query.name}/team/${router.query.tid}`,
    );
  };
  changeWorkType = ({
    currentTarget: { value },
  }: FormEvent<HTMLInputElement>) =>
    (this.work = { ...this.props.work, type: value as TeamWorkType });
  render = () => {
    const { work } = this.props;
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
                defaultValue={work?.title}
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
                defaultValue={work?.description}
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
                  onClick={this.changeWorkType}
                  defaultChecked={work?.type === value}
                />
              ))}
            </Col>
          </Form.Group>
          {work?.type === 'website' && (
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
          {work?.type !== 'website' && (
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
                  defaultValue={work?.url ? [work?.url] : []}
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
