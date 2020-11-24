import { component, mixin, createCell, Fragment, attribute } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { Step } from 'boot-cell/source/Navigator/Stepper';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { TimeRange } from '../../component/TimeRange';
import { bootEditor } from '../../component/HTMLEditor';
import { activity, session } from '../../model';
import { formToJSON } from 'web-utility/source/DOM';

@observer
@component({
    tagName: 'create-activity',
    renderTarget: 'children'
})
export class CreateActivity extends mixin() {
    @attribute
    description;

    @attribute
    aid;

    connectedCallback() {
        this.classList.add('d-block', 'container');

        super.connectedCallback();
    }

    saveBasicForm = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const { target } = event;
        const {
            path_name,
            display_name,
            tags,
            address,
            start_time,
            end_time,
            summary,
            slogan
        } = formToJSON(target as HTMLFormElement);

        await activity.createActivity({
            id: this.aid,
            name: path_name as string,
            creator: session.user._id,
            create_time: Date.now(),
            update_time: Date.now(),
            type: 0,
            display_name: display_name as string,
            ribbon: slogan as string,
            short_description: summary as string,
            description: JSON.stringify(this.description.getContents()),
            tags: tags as string[],
            banners: ['pathToBanner1'],
            location: address as string,
            registration_start_time: start_time[0] as number,
            registration_end_time: end_time[0] as number,
            event_start_time: start_time[1] as number,
            event_end_time: end_time[1] as number,
            judge_start_time: start_time[2] as number,
            judge_end_time: end_time[2] as number,
            awards: [],
            status: 0,
            stat: { register: 0, like: 0 }
        });
    };

    renderBasicForm() {
        return (
            <form className="text-center" onSubmit={this.saveBasicForm}>
                <FormField
                    label="名称"
                    name="path_name"
                    labelColumn={2}
                    placeholder="名称，仅限字母和数字"
                    required
                />
                <FormField
                    label="显示名称"
                    name="display_name"
                    labelColumn={2}
                    placeholder="显示名称"
                    required
                />
                <FormField
                    label="标签"
                    name="tags"
                    labelColumn={2}
                    placeholder="标签"
                />
                <FormField
                    label="活动地址"
                    name="address"
                    labelColumn={2}
                    placeholder="活动地址"
                />
                <div className="row mb-3">
                    <label className="col-2 align-self-center mb-0">
                        活动时间
                    </label>
                    <div className="col-10">
                        <TimeRange />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-2 align-self-center mb-0">
                        报名时间
                    </label>
                    <div className="col-10">
                        <TimeRange />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-2 align-self-center mb-0">
                        评分时间
                    </label>
                    <div className="col-10">
                        <TimeRange />
                    </div>
                </div>
                <FormField
                    label="广告语"
                    name="slogan"
                    labelColumn={2}
                    placeholder="广告语"
                />
                <FormField
                    label="报名人数限制"
                    name="headcount_limit"
                    labelColumn={2}
                    placeholder="报名人数限制（0表示无限）"
                    type="number"
                />
                <FormField
                    label="活动简介"
                    name="summary"
                    labelColumn={2}
                    placeholder="活动简介"
                />
                <div
                    ref={(box: HTMLElement) => {
                        this.description = bootEditor(box, {
                            placeholder: '活动详情'
                        });
                    }}
                    name="description"
                />
                <Button type="submit" className="mt-3">
                    Next
                </Button>
            </form>
        );
    }

    render() {
        return (
            <>
                <h2 className="mt-4">创建活动</h2>

                <TabView linear>
                    <Step icon={1}>填写基本信息</Step>
                    <TabPanel>{this.renderBasicForm()}</TabPanel>

                    <Step icon={2}>选择云服务商</Step>
                    <TabPanel>
                        <form
                            className="text-center"
                            onSubmit={event => event.preventDefault()}
                        >
                            <Button
                                type="reset"
                                color="danger"
                                className="mr-3"
                            >
                                Previous
                            </Button>
                            <Button type="submit">Next</Button>
                        </form>
                    </TabPanel>
                    <Step icon={3}>选择虚拟环境</Step>
                    <TabPanel>
                        <form
                            className="text-center"
                            onSubmit={event => event.preventDefault()}
                        >
                            <Button
                                type="reset"
                                color="danger"
                                className="mr-3"
                            >
                                Previous
                            </Button>
                            <Button type="submit">Next</Button>
                        </form>
                    </TabPanel>
                    <Step icon={4}>完成</Step>
                    <TabPanel>
                        <form
                            className="text-center"
                            onSubmit={event => event.preventDefault()}
                        >
                            <Button
                                type="reset"
                                color="danger"
                                className="mr-3"
                            >
                                Previous
                            </Button>
                            <Button type="submit">Submit</Button>
                        </form>
                    </TabPanel>
                </TabView>
            </>
        );
    }
}
