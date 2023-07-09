import { SpinnerButton } from 'idea-react';
import { observer } from 'mobx-react';
import { FileUploader } from 'mobx-restful-table';
import { FormEvent, PureComponent } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import activityStore from '../../models/Activity';
import fileStore from '../../models/File';
import { i18n } from '../../models/Translation';

const { t } = i18n;

const workTypes = [
  { title: t('website'), value: 'website' },
  { title: t('image'), value: 'image' },
  { title: t('video'), value: 'video' },
  { title: 'Word', value: 'word' },
  { title: 'PowerPoint', value: 'powerpoint' },
  { title: 'PDF', value: 'pdf' },
  { title: 'ZIP', value: 'zip' },
];

export interface WorkEditProps {
  name: string;
  tid: string;
  wid?: string;
}

@observer
export class WorkEdit extends PureComponent<WorkEditProps> {
  store = activityStore.teamOf(this.props.name).workOf(this.props.tid);

  componentDidMount() {
    const { wid } = this.props;

    if (wid) this.store.getOne(wid);
  }

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    await this.store.updateOne(formToJSON(event.currentTarget));

    const { name, tid } = this.props;

    location.pathname = `/activity/${name}/team/${tid}`;
  };

  render() {
    const { uploading, currentOne } = this.store;
    const loading = uploading > 0 || fileStore.uploading > 0;

    return (
      <Container>
        <h2 className="text-center">{t('edit_work')}</h2>

        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="title">
            <Form.Label column sm={2}>
              {t('name')}
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="title"
                type="text"
                placeholder={t('please_enter_name')}
                maxLength={64}
                required
                defaultValue={currentOne?.title}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="description">
            <Form.Label column sm={2}>
              {t('introduction')}
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                name="description"
                as="textarea"
                rows={3}
                placeholder={t('please_enter_description')}
                maxLength={512}
                required
                defaultValue={currentOne?.description}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="type">
            <Form.Label column sm={2}>
              {t('work_type')}
            </Form.Label>
            <Col sm={10}>
              {workTypes.map(({ title, value }) => (
                <Form.Check
                  type="radio"
                  inline
                  label={title}
                  name="type"
                  value={value}
                  id={value}
                  key={value}
                  defaultChecked={currentOne?.type === value}
                />
              ))}
            </Col>
          </Form.Group>
          {currentOne?.type === 'website' && (
            <Form.Group as={Row} className="mb-3" controlId="url">
              <Form.Label column sm={2}>
                {t('work_url')}
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  name="url"
                  type="uri"
                  defaultValue={currentOne.url}
                  maxLength={256}
                  placeholder={t('work_url')}
                />
              </Col>
            </Form.Group>
          )}
          {currentOne?.type !== 'website' && (
            <Form.Group as={Row} className="mb-3" controlId="url">
              <Form.Label column sm={2}>
                {t('upload_file')}
              </Form.Label>
              <Col sm={10}>
                <FileUploader
                  store={fileStore}
                  accept="video/*,image/*,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  name="url"
                  max={1}
                  required
                  defaultValue={currentOne?.url ? [currentOne.url] : []}
                />
              </Col>
            </Form.Group>
          )}
          <SpinnerButton
            className="mb-3"
            variant="primary"
            type="submit"
            loading={loading}
          >
            {t('submit')}
          </SpinnerButton>
        </Form>
      </Container>
    );
  }
}
