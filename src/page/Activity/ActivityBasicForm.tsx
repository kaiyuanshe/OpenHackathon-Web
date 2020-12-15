import { createCell, Fragment } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { formatDate } from 'web-utility/source/date';

import { Activity } from '../../model';
import { TimeRange } from '../../component/TimeRange';

export function ActivityBasicForm({
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
    location
}: Partial<Activity>) {
    return (
        <>
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
                        parent_name="registration"
                        start_time={
                            registration_start_time &&
                            formatDate(
                                new Date(registration_start_time),
                                'YYYY-MM-DDTHH:mm'
                            )
                        }
                        end_time={
                            registration_end_time &&
                            formatDate(
                                new Date(registration_end_time),
                                'YYYY-MM-DDTHH:mm'
                            )
                        }
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label className="col-2 align-self-center mb-0">活动时间</label>
                <div className="col-10">
                    <TimeRange
                        parent_name="event"
                        start_time={
                            event_start_time &&
                            formatDate(
                                new Date(event_start_time),
                                'YYYY-MM-DDTHH:mm'
                            )
                        }
                        end_time={
                            event_end_time &&
                            formatDate(
                                new Date(event_end_time),
                                'YYYY-MM-DDTHH:mm'
                            )
                        }
                    />
                </div>
            </div>
            <div className="row mb-3">
                <label className="col-2 align-self-center mb-0">评分时间</label>
                <div className="col-10">
                    <TimeRange
                        parent_name="judge"
                        start_time={
                            judge_start_time &&
                            formatDate(
                                new Date(judge_start_time),
                                'YYYY-MM-DDTHH:mm'
                            )
                        }
                        end_time={
                            judge_end_time &&
                            formatDate(
                                new Date(judge_end_time),
                                'YYYY-MM-DDTHH:mm'
                            )
                        }
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
        </>
    );
}
