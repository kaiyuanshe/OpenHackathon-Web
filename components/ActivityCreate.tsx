import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import React, { FocusEvent, FormEvent, useRef } from 'react';
import { Activity, ActivityFormData } from '../models/Activity';
import { formToJSON } from 'web-utility';
import { requestClient } from '../pages/api/core';
import { NameAvailability } from '../models/NameAvailability';
import { FileUpload } from './FileUpload';
import { DateTimeInput } from './DateTimeInput';
import { useRouter } from 'next/router';

const ActivityCreate: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const inputParams: ActivityFormData = formToJSON<ActivityFormData>(
      event.target as HTMLFormElement,
    );

    const nameAvailabilityRes = await requestClient<NameAvailability>(
      'hackathon/checkNameAvailability',
      'POST',
      {
        name: inputParams.name,
      },
    );

    if (!nameAvailabilityRes.nameAvailable) {
      alert(`活动名称: ${inputParams.name} 不可用，请更换名称`);
      return;
    }

    inputParams.banners = ([] as string[])
      .concat(inputParams.bannerUrls ?? [])
      .map(bannerUrl => {
        const fileName = bannerUrl.split('/').slice(-1)[0];
        return {
          name: fileName,
          description: fileName,
          uri: bannerUrl,
        };
      });

    inputParams.tags = inputParams?.tagsString?.split(/\s+/) || [];

    const createRes = await requestClient(
      `hackathon/${inputParams.name}`,
      'PUT',
      inputParams as Activity,
    );

    if (confirm('活动创建成功，是否申请发布活动?')) {
      await requestClient(
        `hackathon/${inputParams.name}/requestPublish`,
        'POST',
      );
      alert('已申请发布活动,请等待审核');
    }

    await router.push(`/activity/${inputParams.name}`);
  };

  const validateName = async (event: FocusEvent<HTMLInputElement>) => {
    console.log(nameRef.current?.value);
    if (!nameRef.current?.value) {
      return;
    }

    const nameAvailabilityRes = await requestClient<NameAvailability>(
      'hackathon/checkNameAvailability',
      'POST',
      {
        name: nameRef.current?.value,
      },
    );

    if (!nameAvailabilityRes.nameAvailable) {
      alert(`活动名称: ${nameRef.current!.value} 不可用，请更换名称`);
    }
  };

  return (
    <Container>
      <h2 className="text-center">创建活动</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group as={Row} className="mb-3" controlId="email">
          <Form.Label column sm={2}>
            名称(必填)
          </Form.Label>
          <Col column sm={10}>
            <Form.Control
              name="name"
              type="text"
              placeholder="名称，仅限字母和数字"
              ref={nameRef}
              onBlur={validateName}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="name">
          <Form.Label column sm={2}>
            显示名称(必填)
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
            头图(必填,最多10张)
          </Form.Label>
          <Col column sm={10}>
            <FileUpload
              accept="image/*"
              name="bannerUrls"
              max={2}
              multiple={true}
              required={true}
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

        <DateTimeInput label="报名时间" inputName="enrollment" />
        <DateTimeInput label="活动时间" inputName="event" />
        <DateTimeInput label="评分时间" inputName="judge" />

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
