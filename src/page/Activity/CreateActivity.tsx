import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { Step } from 'boot-cell/source/Navigator/Stepper';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

@observer
@component({
    tagName: 'create-activity',
    renderTarget: 'children'
})
export class CreateActivity extends mixin() {
    render() {
        return (
            <TabView linear>
                <Step icon={1}>填写基本信息</Step>
                <TabPanel>
                    <form
                        className="text-center"
                        onSubmit={event => event.preventDefault()}
                    >
                        <FormField label="名称" placeholder="名称" />
                        <FormField label="显示名称" placeholder="显示名称" />
                        <Button type="submit">Next</Button>
                    </form>
                </TabPanel>
                <Step icon={2}>选择云服务商</Step>
                <TabPanel>
                    <form
                        className="text-center"
                        onSubmit={event => event.preventDefault()}
                    >
                        <Button type="reset" color="danger" className="mr-3">
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
                        <Button type="reset" color="danger" className="mr-3">
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
                        <Button type="reset" color="danger" className="mr-3">
                            Previous
                        </Button>
                        <Button type="submit">Submit</Button>
                    </form>
                </TabPanel>
            </TabView>
        );
    }
}
