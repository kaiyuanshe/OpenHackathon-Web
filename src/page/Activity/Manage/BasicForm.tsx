import { createCell } from 'web-cell';
import classNames from 'classnames';
import { formToJSON } from 'web-utility/source/DOM';

import { FormProps, Form } from 'boot-cell/source/Form/Form';
import { FormField } from 'boot-cell/source/Form/FormField';
import { FileInput } from 'boot-cell/source/Form/FileInput';
import { HTMLEditor } from 'boot-cell/source/Form/HTMLEditor';
import { Image } from 'boot-cell/source/Media/Image';
import { Button } from 'boot-cell/source/Form/Button';
import { FAIcon } from 'boot-cell/source/Reminder/FAIcon';

import { activity, Activity, session } from '../../../model';
import { TimeRange } from '../../../component/TimeRange';

type ActivityBasicFormData = Partial<
    Omit<Activity, 'tags' | 'description'> & {
        tags: string;
        banner: File;
    }
>;
export interface ActivityBasicFormProps extends Omit<FormProps, 'onSubmit'> {
    data?: Partial<Activity>;
    onSubmit(data: Partial<Activity>): any;
}

export function ActivityBasicForm({
    className,
    data: {
        id,
        name,
        displayName,
        tags,
        banners,
        summary,
        ribbon,
        maxEnrollment,
        enrollmentStartedAt,
        enrollmentEndedAt,
        eventStartedAt,
        eventEndedAt,
        judgeStartedAt,
        judgeEndedAt,
        location,
        detail = ''
    } = {},
    onSubmit,
    defaultSlot,
    ...rest
}: ActivityBasicFormProps) {
    async function save(event: Event) {
        event.preventDefault(), event.stopPropagation();

        const form = event.target as HTMLFormElement;
        const { tags, banner, ...input } =
            formToJSON<ActivityBasicFormData>(form);

        if (banner) await activity.addBanner(banner);

        const data = await activity.updateOne({
            ...input,
            tags: tags.split(' ')
        });
        return onSubmit(data);
    }

    return (
        <Form
            {...rest}
            className={classNames('text-center', className)}
            onSubmit={save}
        >
            <input type="hidden" name="id" value={id} />
            <FormField
                label="名称"
                name="name"
                labelColumn={2}
                placeholder="名称，仅限字母和数字"
                value={name}
                required
                readOnly={!!id}
            />
            <FormField
                label="显示名称"
                name="displayName"
                labelColumn={2}
                placeholder="显示名称"
                value={displayName}
                required
            />
            <FormField
                label="标签"
                name="tags"
                labelColumn={2}
                placeholder="标签，请以空格分隔"
                value={tags?.join(' ')}
            />
            <FormField label="头图" labelColumn={2}>
                {banners?.map(({ uri }) => (
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Image style={{ height: '10rem' }} src={uri} />
                        {banners?.[1] && (
                            <Button
                                className="ml-3"
                                color="danger"
                                onClick={() => activity.deleteBanner(uri)}
                            >
                                <FAIcon name="trash-alt" />
                            </Button>
                        )}
                    </div>
                ))}
                <FileInput name="banner" accept="image/*" />
            </FormField>
            <FormField
                label="活动地址"
                name="location"
                labelColumn={2}
                placeholder="活动地址"
                value={location}
            />
            <div className="row mb-3">
                <label className="col-2 align-self-center mb-0">报名时间</label>
                <div className="col-10">
                    <TimeRange
                        name="enrollment"
                        value={[enrollmentStartedAt, enrollmentEndedAt] + ''}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label className="col-2 align-self-center mb-0">活动时间</label>
                <div className="col-10">
                    <TimeRange
                        name="event"
                        value={[eventStartedAt, eventEndedAt] + ''}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label className="col-2 align-self-center mb-0">评分时间</label>
                <div className="col-10">
                    <TimeRange
                        name="judge"
                        value={[judgeStartedAt, judgeEndedAt] + ''}
                    />
                </div>
            </div>
            <FormField
                label="广告语"
                name="ribbon"
                labelColumn={2}
                placeholder="广告语"
                value={ribbon}
            />
            <FormField
                type="number"
                name="maxEnrollment"
                labelColumn={2}
                label="报名人数限制"
                placeholder="0 表示无限"
                required
                value={maxEnrollment?.toString()}
            />
            <FormField
                label="活动简介"
                name="summary"
                labelColumn={2}
                placeholder="活动简介"
                value={summary}
            />
            <HTMLEditor
                theme="snow"
                name="detail"
                placeholder="活动详情"
                value={detail}
                upload={file => session.upload(file)}
            />
            {defaultSlot}
        </Form>
    );
}
