import { createCell } from 'web-cell';
import classNames from 'classnames';
import { FormProps, Form } from 'boot-cell/source/Form/Form';
import { FormField } from 'boot-cell/source/Form/FormField';
import { HTMLEditor } from 'boot-cell/source/Form/HTMLEditor';

import { Activity } from '../../model';
import { TimeRange } from '../../component/TimeRange';

export interface ActivityBasicFormProps extends FormProps {
    data?: Partial<Activity>;
}

export function ActivityBasicForm({
    className,
    data: {
        id,
        name,
        display_name,
        tags,
        short_description,
        ribbon,
        headcount_limit,
        registration_start_time,
        registration_end_time,
        event_start_time,
        event_end_time,
        judge_start_time,
        judge_end_time,
        location,
        description
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
                name="display_name"
                labelColumn={2}
                placeholder="显示名称"
                value={display_name}
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
                        name="registration"
                        value={
                            [registration_start_time, registration_end_time] +
                            ''
                        }
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label className="col-2 align-self-center mb-0">活动时间</label>
                <div className="col-10">
                    <TimeRange
                        name="event"
                        value={[event_start_time, event_end_time] + ''}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label className="col-2 align-self-center mb-0">评分时间</label>
                <div className="col-10">
                    <TimeRange
                        name="judge"
                        value={[judge_start_time, judge_end_time] + ''}
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
                label="报名人数限制"
                name="headcount_limit"
                labelColumn={2}
                placeholder="报名人数限制（0表示无限）"
                type="number"
                value={headcount_limit?.toString()}
            />
            <FormField
                label="活动简介"
                name="short_description"
                labelColumn={2}
                placeholder="活动简介"
                value={short_description}
            />
            <HTMLEditor
                theme="snow"
                name="description"
                placeholder="活动详情"
                value={description}
            />
            {defaultSlot}
        </Form>
    );
}
