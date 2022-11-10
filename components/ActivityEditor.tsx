import { t } from 'i18next';
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
        {t('name')}
        {t('quote_required')}
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="name"
          type="text"
          placeholder={t('name_placeholder')}
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
        {t('disaplay_name')}
        {t('quote_required')}
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="displayName"
          type="text"
          placeholder={t('disaplay_name')}
          required
          defaultValue={activity?.displayName}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="tags">
      <Form.Label column sm={2}>
        {t('tag')}
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="tagsString"
          type="text"
          placeholder={t('tag_placeholder')}
          defaultValue={activity?.tags.join(' ')}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="image">
      <Form.Label column sm={2}>
        {t('bannerUrls')}
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
        {t('activity_address')}
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="location"
          type="text"
          placeholder={t('activity_address')}
          defaultValue={activity?.location}
        />
      </Col>
    </Form.Group>

    <DateTimeInput
      label={t('enrollment') + t('quote_required')}
      name="enrollment"
      startAt={activity?.enrollmentStartedAt}
      endAt={activity?.enrollmentEndedAt}
      required
    />
    <DateTimeInput
      label={t('activity_time') + t('quote_required')}
      name="event"
      startAt={activity?.eventStartedAt}
      endAt={activity?.eventEndedAt}
      required
    />
    <DateTimeInput
      label={t('judge_time') + t('quote_required')}
      name="judge"
      startAt={activity?.judgeStartedAt}
      endAt={activity?.judgeEndedAt}
      required
    />

    <Form.Group as={Row} className="mb-3" controlId="slogan">
      <Form.Label column sm={2}>
        {t('ribbon')}
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="ribbon"
          type="text"
          placeholder={t('ribbon')}
          defaultValue={activity?.ribbon}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="peopleLimit">
      <Form.Label column sm={2}>
        {t('max_enrollment')}
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="maxEnrollment"
          type="number"
          min={0}
          max={100000}
          placeholder={t('max_enrollment_placeholder')}
          defaultValue={activity?.maxEnrollment || 0}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3" controlId="summary">
      <Form.Label column sm={2}>
        {t('activity_introduction')}
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="summary"
          type="text"
          placeholder={t('activity_introduction')}
          defaultValue={activity?.summary}
          required
        />
      </Col>
    </Form.Group>

    {/*//todo editor*/}
    <Form.Group as={Row} className="mb-3" controlId="briefInfo">
      <Form.Label column sm={2}>
        {t('hackathon_detail')}
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          name="detail"
          as="textarea"
          rows={3}
          placeholder={t('hackathon_detail')}
          defaultValue={activity?.detail}
          required
        />
      </Col>
    </Form.Group>

    <Button variant="primary" type="submit">
      {t('submit')}
    </Button>
  </Form>
);
