import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { FormEvent, PureComponent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON, textJoin } from 'web-utility';

import PageHead from '../../../components/PageHead';
import { SessionBox } from '../../../components/User/SessionBox';
import activityStore from '../../../models/Activity';
import { Extensions, Question, questions } from '../../../models/Question';

export async function getServerSideProps({
  params,
  res,
}: GetServerSidePropsContext<{ name: string }>) {
  const { name } = params!;

  const { status } = await activityStore.getOne(name);

  if (status !== 'online') {
    res.statusCode = 403;
    res.end();
  }
  return {
    props: {
      activity: params!.name,
    },
  };
}

class RegisterPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { activity } = this.props,
      data = formToJSON(event.target as HTMLFormElement);

    const extensions = Object.entries(data)
      .map(
        ([name, value]) =>
          value && {
            name,
            value: value + '',
          },
      )
      .filter(Boolean) as Extensions[];

    await activityStore.signOne(activity, extensions);

    self.alert(
      textJoin('黑客松活动', activity, '报名须管理员审核，请耐心等候……'),
    );
    location.href = `/activity/${activity}`;
  };

  renderField = ({ options, multiple, title, ...props }: Question) =>
    options ? (
      <Form.Group as="li" className="mb-3" key={title}>
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
      <Form.Group as="li" className="mb-3 " key={title}>
        {title}
        <Row className="mt-2">
          <Form.Label htmlFor={title}></Form.Label>
          <Form.Control name={title} id={title} {...props} />
        </Row>
      </Form.Group>
    );

  render() {
    const { activity } = this.props;

    return (
      <SessionBox auto className="container">
        <PageHead title={`${activity} 参赛者问卷`} />

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
      </SessionBox>
    );
  }
}

export default RegisterPage;
