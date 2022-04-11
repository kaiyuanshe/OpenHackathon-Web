import { Component, FormEvent } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { Question, questions, Extensions } from '../../../models/Question';
import { formToJSON, textJoin } from 'web-utility';
import { requestClient } from '../../api/core';

class RegisterPage extends Component {
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const data = formToJSON(event.target as HTMLFormElement),
      hackathonName = location.pathname.slice().split('/')[2],
      formData: Extensions[] = Object.entries(data).map(([name, value]) => ({
        name,
        value: value + '',
      }));

    await requestClient(`hackathon/${hackathonName}/enrollment`, 'PUT', {
      extensions: formData,
    });
    self.alert(
      textJoin(
        '黑客松活动',
        `${hackathonName}`,
        '报名须管理员审核，请耐心等候……',
      ),
    );
    location.href = `/activity/${hackathonName}`;
  };
  renderField = (
    { options, multiple, title, ...props }: Question,
    index: number,
  ) =>
    options ? (
      <Form.Group as="li" className="mb-3">
        {title}
        <Row xs={1} sm={3} lg={4} className="mt-2">
          {options.map(value => (
            <Form.Check
              type={multiple ? 'checkbox' : 'radio'}
              label={value}
              name={title}
              value={value}
              id={value}
              key={value}
            />
          ))}
        </Row>
      </Form.Group>
    ) : (
      <Form.Group as="li" className="mb-3 ">
        {title}
        <Row className="mt-2">
          <Form.Label htmlFor={title}></Form.Label>
          <Form.Control name={title} id={title} {...props} />
        </Row>
      </Form.Group>
    );
  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <legend className="text-center">参赛者问卷</legend>
          <small className="text-muted mt-2">
            建议您先完善或更新
            <Link href="https://ophapiv2-demo.authing.cn/u" passHref>
              <a className="text-primary ms-2"> 个人资料</a>
            </Link>
          </small>
          <Col as="ol" className="my-3">
            {questions.map(this.renderField)}
          </Col>
          <Col className="text-center pt-2">
            <Button type="submit" variant="success">
              报名参加
            </Button>
          </Col>
        </Form>
      </Container>
    );
  }
}

export default RegisterPage;
