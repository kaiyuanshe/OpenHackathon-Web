import PageHead from '../../components/PageHead';
import { Button, Col, Container, Form, Row, InputGroup } from 'react-bootstrap';

const createActivity = () => {
  return (
    <>
      <PageHead title="创建活动" />

      <Container>
        <h2>创建活动</h2>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              名称
            </Form.Label>
            <Col column sm={10}>
              <Form.Control
                type="text"
                placeholder="名称，仅限字母和数字"
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              显示名称
            </Form.Label>
            <Col column sm={10}>
              <Form.Control type="text" placeholder="显示名称" required />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              标签
            </Form.Label>
            <Col column sm={10}>
              <Form.Control
                type="text"
                placeholder="标签，请以空格分隔"
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicImage">
            <Form.Label column sm={2}>
              头图
            </Form.Label>
            <Col column sm={10}>
              <Form.Control type="file" accept="image/*" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              活动地址
            </Form.Label>
            <Col column sm={10}>
              <Form.Control type="text" placeholder="活动地址" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              报名时间
            </Form.Label>
            <Col column sm={10}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">时间范围</InputGroup.Text>
                <Form.Control type="datetime-local" />
                <Form.Control type="datetime-local" />
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              活动时间
            </Form.Label>
            <Col column sm={10}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">时间范围</InputGroup.Text>
                <Form.Control type="datetime-local" />
                <Form.Control type="datetime-local" />
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              评分时间
            </Form.Label>
            <Col column sm={10}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">时间范围</InputGroup.Text>
                <Form.Control type="datetime-local" />
                <Form.Control type="datetime-local" />
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              广告语
            </Form.Label>
            <Col column sm={10}>
              <Form.Control type="text" placeholder="广告语" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              报名人数限制
            </Form.Label>
            <Col column sm={10}>
              <Form.Control type="number" placeholder="0 表示无限" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
            <Form.Label column sm={2}>
              活动简介
            </Form.Label>
            <Col column sm={10}>
              <Form.Control as="textarea" rows={3} placeholder="活动简介" />
            </Col>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default createActivity;
