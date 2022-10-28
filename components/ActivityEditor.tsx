import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { FormEvent, PureComponent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import activityStore, { Activity } from '../models/Activity';
import { DateTimeInput } from './DateTimeInput';
import { FileUpload } from './FileUpload';

interface ActivityFormData extends Activity {
  tagsString?: string;
  bannerUrls: string[] | string;
}

export interface ActivityEditorProps {
  name?: string;
}

@observer
export class ActivityEditor extends PureComponent<ActivityEditorProps> {
  componentDidMount() {
    const { name } = this.props;

    if (name) activityStore.getOne(name);
  }

  submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { name } = this.props,
      data = formToJSON<ActivityFormData>(event.currentTarget);

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
    await activityStore.updateOne(data, name);

    if (!name && confirm('活动创建成功，是否申请发布活动?')) {
      await activityStore.publishOne(data.name);

      alert('已申请发布活动，请等待审核……');
    }
    location.pathname = `/`;
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
            显示名称（必填）
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="displayName"
              type="text"
              placeholder="显示名称"
              required
              defaultValue={displayName}
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
              defaultValue={tags.join(' ')}
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
              defaultValue={banners?.map(({ uri }) => uri)}
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
              defaultValue={location}
            />
          </Col>
        </Form.Group>

        <DateTimeInput
          label="报名时间（必填）"
          name="enrollment"
          startAt={enrollmentStartedAt}
          endAt={enrollmentEndedAt}
          required
        />
        <DateTimeInput
          label="活动时间（必填）"
          name="event"
          startAt={eventStartedAt}
          endAt={eventEndedAt}
          required
        />
        <DateTimeInput
          label="评分时间（必填）"
          name="judge"
          startAt={judgeStartedAt}
          endAt={judgeEndedAt}
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
              defaultValue={ribbon}
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
              defaultValue={maxEnrollment || 0}
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
              defaultValue={summary}
              required
            />
          </Col>
        </Form.Group>

        {/* todo editor*/}
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
              defaultValue={detail}
              required
            />
          </Col>
        </Form.Group>

        <footer className="text-center">
          <Button type="submit" className="px-5">
            提交
          </Button>
        </footer>
      </Form>
    );
  }
}
