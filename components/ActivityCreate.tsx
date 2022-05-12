import { FormEvent, FC } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { makeArray, formToJSON } from 'web-utility';

import { DateTimeInput } from './DateTimeInput';
import { FileUpload } from './FileUpload';
import { Activity, NameAvailability } from '../models/Activity';
import { requestClient } from '../pages/api/core';

interface ActivityFormData extends Activity {
  tagsString?: string;
  bannerUrls: string[] | string;
}

const ActivityCreate: FC = () => {
  const router = useRouter();

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams = formToJSON<ActivityFormData>(event.currentTarget);

    const nameAvailable = await isNameAvailable(inputParams.name);

    if (!nameAvailable) return;

    inputParams.banners = makeArray(inputParams.bannerUrls ?? []).map(
      bannerUrl => {
        const name = bannerUrl.split('/').slice(-1)[0];

        return {
          name,
          description: name,
          uri: bannerUrl,
        };
      },
    );
    inputParams.tags = inputParams?.tagsString?.split(/\s+/) || [];

    await requestClient(`hackathon/${inputParams.name}`, 'PUT', inputParams);

    if (confirm('活动创建成功，是否申请发布活动?')) {
      await requestClient(
        `hackathon/${inputParams.name}/requestPublish`,
        'POST',
      );
      alert('已申请发布活动,请等待审核');
    }
    await router.push(`/activity/${inputParams.name}`);
  };

  async function isNameAvailable(name = '') {
    const errorMsg = `活动名称: ${name} 不可用，请更换名称`;

    if (!name) {
      alert(errorMsg);
      return false;
    }
    const { nameAvailable } = await requestClient<NameAvailability>(
      'hackathon/checkNameAvailability',
      'POST',
      { name },
    );
    if (!nameAvailable) alert(errorMsg);

    return nameAvailable;
  }

  return (
    <Container>
      <h2 className="text-center">创建活动</h2>

      <Form onSubmit={submitHandler}>
        <Form.Group as={Row} className="mb-3" controlId="name">
          <Form.Label column sm={2}>
            名称（必填）
          </Form.Label>
          <Col column sm={10}>
            <Form.Control
              name="name"
              type="text"
              placeholder="名称，仅限字母和数字"
              pattern="[a-zA-Z0-9]+"
              onBlur={({ currentTarget: { value } }) => isNameAvailable(value)}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="displayName">
          <Form.Label column sm={2}>
            显示名称（必填）
          </Form.Label>
          <Col column sm={10}>
            <Form.Control
              name="displayName"
              type="text"
              placeholder="显示名称"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="tags">
          <Form.Label column sm={2}>
            标签
          </Form.Label>
          <Col column sm={10}>
            <Form.Control
              name="tagsString"
              type="text"
              placeholder="标签，请以空格分隔"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="image">
          <Form.Label column sm={2}>
            头图（必填，最多10张）
          </Form.Label>
          <Col column sm={10}>
            <FileUpload
              accept="image/*"
              name="bannerUrls"
              max={2}
              multiple
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="location">
          <Form.Label column sm={2}>
            活动地址
          </Form.Label>
          <Col column sm={10}>
            <Form.Control name="location" type="text" placeholder="活动地址" />
          </Col>
        </Form.Group>

        <DateTimeInput label="报名时间（必填）" name="enrollment" required />
        <DateTimeInput label="活动时间（必填）" name="event" required />
        <DateTimeInput label="评分时间（必填）" name="judge" required />

        <Form.Group as={Row} className="mb-3" controlId="slogan">
          <Form.Label column sm={2}>
            广告语
          </Form.Label>
          <Col column sm={10}>
            <Form.Control name="ribbon" type="text" placeholder="广告语" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="peopleLimit">
          <Form.Label column sm={2}>
            报名人数限制
          </Form.Label>
          <Col column sm={10}>
            <Form.Control
              name="maxEnrollment"
              type="number"
              placeholder="0 表示无限"
              defaultValue={0}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="summary">
          <Form.Label column sm={2}>
            活动简介
          </Form.Label>
          <Col column sm={10}>
            <Form.Control name="summary" type="text" placeholder="活动简介" />
          </Col>
        </Form.Group>

        {/*//todo editor*/}
        <Form.Group as={Row} className="mb-3" controlId="briefInfo">
          <Form.Label column sm={2}>
            活动详情
          </Form.Label>
          <Col column sm={10}>
            <Form.Control
              name="detail"
              as="textarea"
              rows={3}
              placeholder="活动详情"
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default ActivityCreate;
