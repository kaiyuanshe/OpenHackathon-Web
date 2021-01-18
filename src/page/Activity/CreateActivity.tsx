import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { formToJSON } from 'web-utility/source/DOM';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { Step } from 'boot-cell/source/Navigator/Stepper';
import { Button } from 'boot-cell/source/Form/Button';

import { ActivityBasicForm } from './ActivityBasicForm';
import { activity, Activity } from '../../model';

@observer
@component({
    tagName: 'create-activity',
    renderTarget: 'children'
})
export class CreateActivity extends mixin() {
    private tabView: TabView;

    connectedCallback() {
        this.classList.add('d-block', 'container');

        super.connectedCallback();
    }

    saveBasicForm = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const form = event.target as HTMLFormElement;
        const data = formToJSON<
            Partial<Omit<Activity, 'tags' | 'description'> & { tags: string }>
        >(form);

        await activity.createActivity({
            ...data,
            tags: data.tags.split(' ')
        });
        this.tabView.activeIndex++;
    };

    render() {
        const { loading } = activity;

        return (
            <>
                <h2 className="mt-4">创建活动</h2>

                <TabView
                    linear
                    ref={(element: TabView) => (this.tabView = element)}
                >
                    <Step icon={1}>填写基本信息</Step>
                    <TabPanel>
                        <ActivityBasicForm onSubmit={this.saveBasicForm}>
                            <Button
                                type="submit"
                                color="primary"
                                className="mt-3"
                                disabled={loading}
                            >
                                下一步
                            </Button>
                        </ActivityBasicForm>
                    </TabPanel>

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
                            <Button type="submit" color="primary">
                                下一步
                            </Button>
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
                            <Button type="submit" color="primary">
                                下一步
                            </Button>
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
                            <Button type="submit" color="success">
                                提交
                            </Button>
                        </form>
                    </TabPanel>
                </TabView>
            </>
        );
    }
}
