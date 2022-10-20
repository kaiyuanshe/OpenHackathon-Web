import { FC, FormEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { Activity } from '../models/Activity';
import { DateTimeInput } from './DateTimeInput';
import { FileUpload } from './FileUpload';

type ActivityEditorProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isNameAvailable?: (name?: string) => Promise<boolean>;
  activity?: Activity;
};

export const ActivityEditor: FC<ActivityEditorProps> = ({
  onSubmit,
  isNameAvailable,
  activity,
}) => (
  <Form onSubmit={onSubmit}>
    <Form.Group as={Row} className="mb-3" controlId="name">
      <Form.Label column sm={2}>
        名称（必填）
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="name"
          type="text"
          placeholder="名称，仅限字母和数字"
          pattern="[a-zA-Z0-9]+"
          onBlur={({ currentTarget: { value } }) => isNameAvailable?.(value)}
          required
          defaultValue={activity?.name}
          readOnly={!!activity}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="displayName">
      <Form.Label column sm={2}>
        显示名称（必填）
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="displayName"
          type="text"
          placeholder="显示名称"
          required
          defaultValue={activity?.displayName}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="tags">
      <Form.Label column sm={2}>
        标签
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="tagsString"
          type="text"
          placeholder="标签，请以空格分隔"
          defaultValue={activity?.tags.join(' ')}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="image">
      <Form.Label column sm={2}>
        头图（必填，最多10张）
      </Form.Label>
      <Col sm={10}>
        <FileUpload
          accept="image/*"
          name="bannerUrls"
          max={10}
          multiple
          required
          defaultValue={activity?.banners?.map(({ uri }) => uri)}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="location">
      <Form.Label column sm={2}>
        活动地址
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="location"
          type="text"
          placeholder="活动地址"
          defaultValue={activity?.location}
        />
      </Col>
    </Form.Group>

    <DateTimeInput
      label="报名时间（必填）"
      name="enrollment"
      startAt={activity?.enrollmentStartedAt}
      endAt={activity?.enrollmentEndedAt}
      required
    />
    <DateTimeInput
      label="活动时间（必填）"
      name="event"
      startAt={activity?.eventStartedAt}
      endAt={activity?.eventEndedAt}
      required
    />
    <DateTimeInput
      label="评分时间（必填）"
      name="judge"
      startAt={activity?.judgeStartedAt}
      endAt={activity?.judgeEndedAt}
      required
    />

    <Form.Group as={Row} className="mb-3" controlId="slogan">
      <Form.Label column sm={2}>
        广告语
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="ribbon"
          type="text"
          placeholder="广告语"
          defaultValue={activity?.ribbon}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="peopleLimit">
      <Form.Label column sm={2}>
        报名人数限制
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="maxEnrollment"
          type="number"
          min={0}
          max={100000}
          placeholder="0 表示无限"
          defaultValue={activity?.maxEnrollment || 0}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="summary">
      <Form.Label column sm={2}>
        活动简介
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="summary"
          type="text"
          placeholder="活动简介"
          defaultValue={activity?.summary}
          required
        />
      </Col>
    </Form.Group>

    {/*//todo editor*/}
    <Form.Group as={Row} className="mb-3" controlId="briefInfo">
      <Form.Label column sm={2}>
        活动详情
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="detail"
          as="textarea"
          rows={3}
          placeholder="活动详情"
          defaultValue={activity?.detail}
          required
        />
      </Col>
    </Form.Group>

    <Button variant="primary" type="submit">
      提交
    </Button>
  </Form>
);
