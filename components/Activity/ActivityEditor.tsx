import { Loading } from 'idea-react';
import { observable } from 'mobx';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { BadgeInput, FileUploader } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { FormEvent, PureComponent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import activityStore, { Activity } from '../../models/Activity';
import fileStore from '../../models/File';
import { i18n } from '../../models/Translation';
import { DateTimeInput } from '../DateTimeInput';

const { t } = i18n;

const HTMLEditor = dynamic(() => import('../HTMLEditor'), {
  ssr: false,
});

interface ActivityFormData extends Activity {
  bannerUrls: string[] | string;
}

export interface ActivityEditorProps {
  name?: string;
}

const isEmptyHTML = (html: string): boolean => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent?.trim() === '';
};

@observer
export class ActivityEditor extends PureComponent<ActivityEditorProps> {
  @observable
  detailHTML = '';

  @observable
  validated = false;

  async componentDidMount() {
    const { name } = this.props;

    if (!name) return;

    const { detail } = await activityStore.getOne(name);

    this.detailHTML = detail || '';
  }

  componentWillUnmount() {
    activityStore.clearCurrent();
  }

  submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (!form.checkValidity()) return (this.validated = true);

    const { name } = this.props,
      data = formToJSON<ActivityFormData>(form);

    data.detail = (data.detail || '') + '';

    data.banners = [data.bannerUrls ?? []].flat().map(bannerUrl => {
      const name = bannerUrl.split('/').slice(-1)[0];

      return {
        name,
        description: name,
        uri: bannerUrl,
      };
    });
    // @ts-ignore
    await activityStore.updateOne(data, name);

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

    const loading = downloading > 0 || uploading > 0 || fileStore.uploading > 0;

    return (
      <Form
        noValidate
        className="container-fluid"
        validated={this.validated}
        onSubmit={this.submitHandler}
      >
        {loading && <Loading />}

        <Form.Group as={Row} className="mb-3" controlId="name">
          <Form.Label column sm={2}>
            {t('activity_id')}
            <span className="text-danger"> *</span>
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="name"
              type="text"
              placeholder={t('name_placeholder')}
              pattern="[a-zA-Z0-9]+"
              required
              defaultValue={name}
              readOnly={!!name}
            />
            <Form.Control.Feedback type="invalid">
              {textJoin(t('please_enter'), t('activity_id'))}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="displayName">
          <Form.Label column sm={2}>
            {t('activity_name')}
            <span className="text-danger"> *</span>
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="displayName"
              type="text"
              required
              defaultValue={displayName}
            />
            <Form.Control.Feedback type="invalid">
              {textJoin(t('please_enter'), t('activity_name'))}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="tags">
          <Form.Label column sm={2}>
            {t('tag')}
          </Form.Label>
          <Col sm={10}>
            <BadgeInput
              name="tags"
              placeholder={t('tag_placeholder')}
              defaultValue={tags}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="image">
          <Form.Label column sm={2}>
            {t('bannerUrls')}
            <span className="text-danger"> *</span>
          </Form.Label>
          <Col sm={10}>
            <FileUploader
              store={fileStore}
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
            <span className="text-danger"> *</span>
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="location"
              type="text"
              required
              defaultValue={location}
            />
            <Form.Control.Feedback type="invalid">
              {textJoin(t('please_enter'), t('activity_address'))}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <DateTimeInput
          label={t('enrollment')}
          name="enrollment"
          key="enrollment"
          startAt={enrollmentStartedAt}
          endAt={enrollmentEndedAt}
          required
        />
        <DateTimeInput
          label={t('activity_time')}
          name="event"
          key="event"
          startAt={eventStartedAt}
          endAt={eventEndedAt}
          required
        />
        <DateTimeInput
          label={t('judge_time')}
          name="judge"
          key="judge"
          startAt={judgeStartedAt}
          endAt={judgeEndedAt}
          required
        />

        <Form.Group as={Row} className="mb-3" controlId="slogan">
          <Form.Label column sm={2}>
            {t('ribbon')}
          </Form.Label>
          <Col sm={10}>
            <Form.Control name="ribbon" defaultValue={ribbon} />
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
            <span className="text-danger"> *</span>
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="summary"
              type="text"
              defaultValue={summary}
              required
            />
            <Form.Control.Feedback type="invalid">
              {textJoin(t('please_enter'), t('activity_introduction'))}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="briefInfo">
          <Form.Label column sm={2}>
            {t('activity_detail')}
            <span className="text-danger"> *</span>
          </Form.Label>
          <Col sm={10}>
            <HTMLEditor
              defaultValue={this.detailHTML}
              onChange={code =>
                (this.detailHTML = isEmptyHTML(code) ? '' : code)
              }
            />
            <Form.Control
              hidden
              name="detail"
              required
              value={this.detailHTML}
            />
            <Form.Control.Feedback type="invalid">
              {textJoin(t('please_enter'), t('activity_detail'))}
            </Form.Control.Feedback>
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
