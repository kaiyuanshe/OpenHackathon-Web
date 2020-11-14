import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { Step } from 'boot-cell/source/Navigator/Stepper';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { TimeRange } from '../../component/TimeRange';
import { bootEditor } from '../../component/HTMLEditor';

@observer
@component({
    tagName: 'create-activity',
    renderTarget: 'children'
})
export class CreateActivity extends mixin() {
    connectedCallback() {
        this.classList.add('d-block', 'container');

        super.connectedCallback();
    }

    renderBasicForm() {
        return (
            <form
                className="text-center"
                onSubmit={event => event.preventDefault()}
            >
                <FormField
                    label="名称"
                    labelColumn={2}
                    placeholder="名称"
                    required
                />
                <FormField
                    label="显示名称"
                    labelColumn={2}
                    placeholder="显示名称"
                    required
                />
                <FormField label="标签" labelColumn={2} placeholder="标签" />
                <FormField
                    label="活动地址"
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
                    labelColumn={2}
                    placeholder="广告语"
                />
                <FormField
                    label="报名人数限制"
                    labelColumn={2}
                    placeholder="报名人数限制（0表示无限）"
                    type="number"
                />
                <FormField
                    label="活动简介"
                    labelColumn={2}
                    placeholder="活动简介"
                />
                <div
                    ref={(box: HTMLElement) =>
                        bootEditor(box, { placeholder: '活动详情' })
                    }
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
