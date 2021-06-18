import { createCell } from 'web-cell';
import classNames from 'classnames';
import { FormProps, Form } from 'boot-cell/source/Form/Form';
import { FormField } from 'boot-cell/source/Form/FormField';
import { HTMLEditor } from 'boot-cell/source/Form/HTMLEditor';

import { Activity } from '../../model';
import { TimeRange } from '../../component/TimeRange';

export type ActivityBasicFormData = Partial<
    Omit<Activity, 'tags' | 'description'> & { tags: string }
>;

export interface ActivityBasicFormProps extends FormProps {
    data?: Partial<Activity>;
}

export function ActivityBasicForm({
    className,
    data: {
        id,
        name,
        displayName,
        tags,
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
        detail
    } = {},
    defaultSlot,
    ...rest
}: ActivityBasicFormProps) {
    return (
        <Form {...rest} className={classNames('text-center', className)}>
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
            />
            {defaultSlot}
        </Form>
    );
}
