import { importCSS, formToJSON } from 'web-utility/source/DOM';
import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { ListItem } from 'boot-cell/source/Content/ListGroup';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';
import { observer } from 'mobx-web-cell';

import { activity, Activity } from '../../model';
import { TimeRange } from '../../component/TimeRange';
import { bootEditor } from '../../component/HTMLEditor';
import Quill from 'quill';

importCSS('https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css');
@observer
@component({
    tagName: 'edit-activity',
    renderTarget: 'children'
})
export class EditActivity extends mixin() {
    @attribute
    @watch
    name = '';

    private description: Quill;

    connectedCallback() {
        this.classList.add('d-block', 'container');
        activity.getOne(this.name);
        super.connectedCallback();
    }

    saveBasicForm = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const data = formToJSON<
            Partial<Omit<Activity, 'tags' | 'description'> & { tags: string }>
        >(event.target as HTMLFormElement);

        await activity.updateActivity({
            ...data,
            description: this.description.root.innerHTML,
            tags: data.tags.split(' ')
        });
    };

    renderBasicForm() {
        const {
            display_name,
            tags,
            short_description,
            description,
            ribbon,
            headcount_limit,
            registration_start_time,
            registration_end_time,
            event_start_time,
            event_end_time,
            judge_start_time,
            judge_end_time,
            location
        } = activity.current;

        return (
            <form className="text-center" onSubmit={this.saveBasicForm}>
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
                    <label className="col-2 align-self-center mb-0">
                        报名时间
                    </label>
                    <div className="col-10">
                        <TimeRange
                            parent_name="registration"
                            start_time={new Date(
                                new Date(registration_start_time)
                                    .toString()
                                    .split('GMT')[0] + ' UTC'
                            )
                                .toISOString()
                                .substring(0, 16)}
                            end_time={new Date(
                                new Date(registration_end_time)
                                    .toString()
                                    .split('GMT')[0] + ' UTC'
                            )
                                .toISOString()
                                .substring(0, 16)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-2 align-self-center mb-0">
                        活动时间
                    </label>
                    <div className="col-10">
                        <TimeRange
                            parent_name="event"
                            start_time={new Date(
                                new Date(event_start_time)
                                    .toString()
                                    .split('GMT')[0] + ' UTC'
                            )
                                .toISOString()
                                .substring(0, 16)}
                            end_time={new Date(
                                new Date(event_end_time)
                                    .toString()
                                    .split('GMT')[0] + ' UTC'
                            )
                                .toISOString()
                                .substring(0, 16)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-2 align-self-center mb-0">
                        评分时间
                    </label>
                    <div className="col-10">
                        <TimeRange
                            parent_name="judge"
                            start_time={new Date(
                                new Date(judge_start_time)
                                    .toString()
                                    .split('GMT')[0] + ' UTC'
                            )
                                .toISOString()
                                .substring(0, 16)}
                            end_time={new Date(
                                new Date(judge_end_time)
                                    .toString()
                                    .split('GMT')[0] + ' UTC'
                            )
                                .toISOString()
                                .substring(0, 16)}
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
                <div
                    ref={(box: HTMLElement) => {
                        box.innerHTML = description;
                        this.description = bootEditor(box, {
                            placeholder: '活动详情'
                        });
                    }}
                />
                <Button type="submit" className="mt-3">
                    保存
                </Button>
            </form>
        );
    }

    render() {
        return (
            <>
                <TabView mode="list" direction="column" className="mt-3">
                    <ListItem>编辑活动</ListItem>
                    <TabPanel>
                        <div className="row mb-3">
                            <label className="col-2 text-center mb-0">
                                名称
                            </label>
                            <div className="col-10">
                                {activity.current.name}
                            </div>
                        </div>
                        {this.renderBasicForm()}
                    </TabPanel>
                    <ListItem>报名用户</ListItem>
                    <TabPanel>
                        To implement{/* 包括选手，导师，评委 */}
                    </TabPanel>
                    <ListItem>管理员</ListItem>
                    <TabPanel>To implement</TabPanel>

                    <ListItem>奖项设置</ListItem>
                    <TabPanel>To implement</TabPanel>
                    <ListItem>作品评奖</ListItem>
                    <TabPanel> To implement</TabPanel>
                    <ListItem>主办方信息</ListItem>
                    <TabPanel> To implement</TabPanel>
                    <ListItem>公告</ListItem>
                    <TabPanel> To implement</TabPanel>
                </TabView>
            </>
        );
    }
}
