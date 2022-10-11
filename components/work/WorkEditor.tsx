import { FC, FormEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { TeamWork } from '../../models/Team';
import { FileUpload } from '../FileUpload';

type WorkEditorProps = {
  work?: TeamWork;
  onSubmit: (event: FormEvent<HTMLFormElement>) => any;
};

export const WorkEditor: FC<WorkEditorProps> = ({
  onSubmit,
  work = { type: 'website' },
}) => {
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
  return (
    <Form onSubmit={onSubmit}>
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
      {work.type}
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
              onClick={e => {
                // work.type = e.target.value;
                console.log(work);
              }}
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
      <Button variant="primary" type="submit">
        提交
      </Button>
    </Form>
  );
};
