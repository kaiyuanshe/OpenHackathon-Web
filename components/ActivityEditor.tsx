import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { FormEvent, PureComponent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import activityStore, { Activity } from '../models/Activity';
import { i18n } from '../models/Translation';
import { DateTimeInput } from './DateTimeInput';
import { FileUpload } from './FileUpload';

const { t } = i18n;

const HTMLEditor = dynamic(() => import('../components/HTMLEditor'), {
  ssr: false,
});

interface ActivityFormData extends Activity {
  tagsString?: string;
  bannerUrls: string[] | string;
}

export interface ActivityEditorProps {
  name?: string;
}

@observer
export class ActivityEditor extends PureComponent<ActivityEditorProps> {
  detailHTML = '';

  async componentDidMount() {
    const { name } = this.props;

    if (!name) return;

    const { detail } = await activityStore.getOne(name);

    this.detailHTML = detail;
  }

  submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { name } = this.props,
      { detailHTML } = this;

    if (!detailHTML.trim()) return;

    const data = formToJSON<ActivityFormData>(event.currentTarget);

    data.banners = [data.bannerUrls ?? []].flat().map(bannerUrl => {
      const name = bannerUrl.split('/').slice(-1)[0];

      return {
        name,
        description: name,
        uri: bannerUrl,
      };
    });
    data.tags = data?.tagsString?.split(/\s+/) || [];
    // @ts-ignore
    await activityStore.updateOne({ ...data, detail: detailHTML.trim() }, name);

    if (!name && confirm(t('create_work_success'))) {
      await activityStore.publishOne(data.name);

      alert(t('has_published'));
    }
    location.pathname = name ? `/activity/${name}` : `/`;
  };

  render() {
    const {
        name,
        displayName,
        tags = [],
        banners,
        location,
        enrollmentStartedAt,
        enrollmentEndedAt,
        eventStartedAt,
        eventEndedAt,
        judgeStartedAt,
        judgeEndedAt,
        ribbon,
        maxEnrollment,
        summary,
        detail,
      } = activityStore.currentOne,
      { downloading, uploading } = activityStore;

    const loading = downloading > 0 || uploading > 0;

    return (
      <Form className="container-fluid" onSubmit={this.submitHandler}>
        {loading && <Loading />}

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
              required
              defaultValue={name}
              readOnly={!!name}
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
              defaultValue={displayName}
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
              defaultValue={tags.join(' ')}
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
              defaultValue={banners?.map(({ uri }) => uri)}
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
              defaultValue={location}
            />
          </Col>
        </Form.Group>

        <DateTimeInput
          label={t('enrollment') + t('quote_required')}
          name="enrollment"
          startAt={enrollmentStartedAt}
          endAt={enrollmentEndedAt}
          required
        />
        <DateTimeInput
          label={t('activity_time') + t('quote_required')}
          name="event"
          startAt={eventStartedAt}
          endAt={eventEndedAt}
          required
        />
        <DateTimeInput
          label={t('judge_time') + t('quote_required')}
          name="judge"
          startAt={judgeStartedAt}
          endAt={judgeEndedAt}
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
              defaultValue={ribbon}
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
              defaultValue={maxEnrollment || 0}
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
              defaultValue={summary}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="briefInfo">
          <Form.Label column sm={2}>
            {t('hackathon_detail')}
          </Form.Label>
          <Col sm={10}>
            <HTMLEditor
              defaultValue={detail}
              onChange={code => (this.detailHTML = code)}
            />
          </Col>
        </Form.Group>

        <footer className="text-center">
          <Button type="submit" className="px-5">
            {t('submit')}
          </Button>
        </footer>
      </Form>
    );
  }
}
