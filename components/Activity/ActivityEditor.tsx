import { Hackathon, Media } from '@kaiyuanshe/openhackathon-service';
import { Loading } from 'idea-react';
import { computed } from 'mobx';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import {
  ArrayField,
  ArrayFieldProps,
  Field,
  FileUploader,
  FormField,
  RestForm,
} from 'mobx-restful-table';

import activityStore from '../../models/Activity';
import fileStore from '../../models/Base/File';
import { i18n, I18nContext } from '../../models/Base/Translation';
import { DateTimeInput } from '../DateTimeInput';
import { CustomTools } from '../HTMLEditor';

export interface ActivityEditorProps {
  name?: string;
}

@observer
export class ActivityEditor extends ObservedComponent<ActivityEditorProps, typeof i18n> {
  static contextType = I18nContext;

  submitHandler = async ({ name }: Hackathon) => {
    const { t } = this.observedContext;

    if (!name && confirm(t('create_work_success'))) {
      await activityStore.publishOne(name);

      alert(t('has_published'));
    }
    location.pathname = name ? `/activity/${name}` : `/`;
  };

  @computed
  get fields(): Field<Hackathon>[] {
    const i18n = this.observedContext;
    const { t } = i18n;

    return [
      {
        key: 'name',
        renderLabel: t('activity_id'),
        pattern: '[\\w-]+',
        required: true,
        invalidMessage: t('name_placeholder'),
      },
      {
        key: 'displayName',
        renderLabel: t('activity_name'),
        required: true,
        invalidMessage: textJoin(t('please_enter'), t('activity_name')),
      },
      { key: 'tags', renderLabel: t('tag'), multiple: true, placeholder: t('tag_placeholder') },
      {
        key: 'banners',
        renderLabel: t('bannerUrls'),
        max: 10,
        renderInput: ({ banners }, { key, ...meta }) => (
          <RestForm.FieldBox name={key} {...meta}>
            <ArrayField name="banners" defaultValue={banners} renderItem={this.renderMedia(i18n)} />
          </RestForm.FieldBox>
        ),
      },
      {
        key: 'location',
        renderLabel: t('activity_address'),
        required: true,
        invalidMessage: textJoin(t('please_enter'), t('activity_address')),
      },
      {
        key: 'enrollmentStartedAt',
        renderInput: ({ enrollmentStartedAt, enrollmentEndedAt }) => (
          <DateTimeInput
            key="enrollment"
            label={t('enrollment')}
            name="enrollment"
            startAt={enrollmentStartedAt}
            endAt={enrollmentEndedAt}
            required
          />
        ),
      },
      {
        key: 'eventStartedAt',
        renderInput: ({ eventStartedAt, eventEndedAt }) => (
          <DateTimeInput
            key="event"
            label={t('activity_time')}
            name="event"
            startAt={eventStartedAt}
            endAt={eventEndedAt}
            required
          />
        ),
      },
      {
        key: 'judgeStartedAt',
        renderInput: ({ judgeStartedAt, judgeEndedAt }) => (
          <DateTimeInput
            key="judge"
            label={t('judge_time')}
            name="judge"
            startAt={judgeStartedAt}
            endAt={judgeEndedAt}
            required
          />
        ),
      },
      { key: 'ribbon', renderLabel: t('ribbon') },
      {
        key: 'maxEnrollment',
        renderLabel: t('max_enrollment'),
        placeholder: t('max_enrollment_placeholder'),
        type: 'number',
        min: 0,
        max: 100000,
      },
      {
        key: 'summary',
        renderLabel: t('activity_introduction'),
        required: true,
        invalidMessage: textJoin(t('please_enter'), t('activity_introduction')),
      },
      {
        key: 'detail',
        renderLabel: t('activity_detail'),
        contentEditable: true,
        tools: CustomTools,
        required: true,
        invalidMessage: textJoin(t('please_enter'), t('activity_detail')),
      },
    ];
  }

  renderMedia =
    ({ t }: typeof i18n): ArrayFieldProps<Media>['renderItem'] =>
    ({ uri, name, description }) => (
      <div className="d-flex align-items-center gap-2">
        <FileUploader
          store={fileStore}
          name="uri"
          accept="image/*"
          multiple
          defaultValue={uri ? [uri] : []}
        />
        <FormField label={t('name')} name="name" defaultValue={name} />
        <FormField
          label={t('description')}
          as="textarea"
          rows={3}
          name="description"
          defaultValue={description}
        />
      </div>
    );

  render() {
    const i18n = this.observedContext,
      { downloading, uploading } = activityStore;

    const loading = downloading > 0 || uploading > 0 || fileStore.uploading > 0;

    return (
      <>
        <RestForm
          className="container-fluid"
          translator={i18n}
          store={activityStore}
          fields={this.fields}
          onSubmit={this.submitHandler}
        />
        {loading && <Loading />}
      </>
    );
  }
}
