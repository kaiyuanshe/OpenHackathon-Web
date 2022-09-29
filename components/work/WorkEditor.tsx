import { FC, FormEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { TeamWork } from '../../models/Team';

type WorkEditorProps = {
  work?: TeamWork;
  onSubmit: (event: FormEvent<HTMLFormElement>) => any;
};

export const WorkEditor: FC<WorkEditorProps> = ({ onSubmit, work }) => (
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
          defaultValue={work?.title}
          readOnly={!!work}
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
          readOnly={!!work}
        />
      </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3" controlId="url">
      <Form.Label column sm={2}>
        项目地址
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="url"
          type="uri"
          placeholder="项目演示地址"
          defaultValue={work?.url}
        />
      </Col>
    </Form.Group>
    {/* <Form.Group as={Row} className="mb-3" controlId="url">
      <Form.Label column sm={2}>
      图片地址
      </Form.Label>
       <FileUpload 
   accept="image/*" 
   name="bannerUrls" 
   max={10} 
   multiple 
   required 
   defaultValue={activity?.banners?.map(({ uri }) => uri)} 
 /> 
      <Col sm={10}>
        <Form.Control
          name="image"
          type="uri"
          placeholder="图片地址"
          defaultValue={work?.type?.image}
        />
      </Col>
    </Form.Group> */}
    <Button variant="primary" type="submit">
      提交
    </Button>
  </Form>
);
