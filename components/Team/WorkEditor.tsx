import { SpinnerButton } from 'idea-react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { FileUploader } from 'mobx-restful-table';
import { FormEvent } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import activityStore from '../../models/Activity';
import fileStore from '../../models/Base/File';
import { i18n, I18nContext } from '../../models/Base/Translation';

export interface WorkEditorProps {
  name: string;
  tid: number;
  wid?: string;
}

@observer
export class WorkEditor extends ObservedComponent<WorkEditorProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.teamOf(this.props.name).workOf(this.props.tid);

  @computed
  get workTypes() {
    const { t } = this.observedContext;

    return [
      { title: t('website'), value: 'website' },
      { title: t('image'), value: 'image', accept: 'image/*' },
      { title: t('video'), value: 'video', accept: 'video/*' },
      {
        title: 'Word',
        value: 'word',
        accept:
          'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
      {
        title: 'PowerPoint',
        value: 'powerpoint',
        accept:
          'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation',
      },
      { title: 'PDF', value: 'pdf', accept: 'application/pdf' },
      { title: 'ZIP', value: 'zip', accept: 'application/zip' },
    ];
  }

  @observable
  accessor currentType = this.workTypes[0].value;

  async componentDidMount() {
    const { wid } = this.props;

    if (!wid) return;

    const { type } = await this.store.getOne(wid);

    this.currentType = type;
  }

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    await this.store.updateOne(formToJSON(event.currentTarget));

    const { name, tid } = this.props;

    location.pathname = `/activity/${name}/team/${tid}`;
  };

  render() {
    const { t } = this.observedContext,
      { workTypes, currentType } = this,
      { uploading, currentOne } = this.store;
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
                  key={value}
                  type="radio"
                  inline
                  label={title}
                  name="type"
                  value={value}
                  id={value}
                  checked={currentType === value}
                  onClick={() => (this.currentType = value)}
                />
              ))}
            </Col>
          </Form.Group>
          {currentType === 'website' ? (
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
          ) : (
            <Form.Group as={Row} className="mb-3" controlId="url">
              <Form.Label column sm={2}>
                {t('upload_file')}
              </Form.Label>
              <Col sm={10}>
                <FileUploader
                  store={fileStore}
                  name="url"
                  accept={workTypes.find(({ value }) => value === currentType)?.accept}
                  max={1}
                  required
                  defaultValue={currentOne?.url ? [currentOne.url] : []}
                />
              </Col>
            </Form.Group>
          )}
          <SpinnerButton className="mb-3" variant="primary" type="submit" loading={loading}>
            {t('submit')}
          </SpinnerButton>
        </Form>
      </Container>
    );
  }
}
