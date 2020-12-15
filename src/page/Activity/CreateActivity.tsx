import { importCSS, formToJSON } from 'web-utility/source/DOM';
import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { Step } from 'boot-cell/source/Navigator/Stepper';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';
import Quill from 'quill';

import { ActivityBasicForm } from './ActivityBasicForm';
import { bootEditor } from '../../component/HTMLEditor';
import { activity, Activity } from '../../model';

importCSS('https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css');

@observer
@component({
    tagName: 'create-activity',
    renderTarget: 'children'
})
export class CreateActivity extends mixin() {
    private tabView: TabView;
    private description: Quill;

    connectedCallback() {
        this.classList.add('d-block', 'container');

        super.connectedCallback();
    }

    saveBasicForm = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const data = formToJSON<
            Partial<Omit<Activity, 'tags' | 'description'> & { tags: string }>
        >(event.target as HTMLFormElement);

        await activity.createActivity({
            ...data,
            description: this.description.root.innerHTML,
            tags: data.tags.split(' ')
        });

        this.tabView.activeIndex++;
    };

    renderBasicForm() {
        return (
            <form className="text-center" onSubmit={this.saveBasicForm}>
                <FormField
                    label="名称"
                    name="name"
                    labelColumn={2}
                    placeholder="名称，仅限字母和数字"
                    required
                />
                <ActivityBasicForm />

                <div
                    ref={(box: HTMLElement) => {
                        this.description = bootEditor(box, {
                            placeholder: '活动详情'
                        });
                    }}
                />
                <Button type="submit" className="mt-3">
                    下一步
                </Button>
            </form>
        );
    }

    render() {
        return (
            <>
                <h2 className="mt-4">创建活动</h2>

                <TabView
                    linear
                    ref={(element: TabView) => (this.tabView = element)}
                >
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
                                上一步
                            </Button>
                            <Button type="submit">下一步</Button>
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
                                上一步
                            </Button>
                            <Button type="submit">下一步</Button>
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
                                上一步
                            </Button>
                            <Button type="submit">提交</Button>
                        </form>
                    </TabPanel>
                </TabView>
            </>
        );
    }
}
