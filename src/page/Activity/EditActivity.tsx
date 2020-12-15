import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { formToJSON } from 'web-utility/source/DOM';
import { observer } from 'mobx-web-cell';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { ListItem } from 'boot-cell/source/Content/ListGroup';
import { Button } from 'boot-cell/source/Form/Button';

import { HTMLEditor } from '../../component/HTMLEditor';
import { ActivityBasicForm } from './ActivityBasicForm';
import { activity, Activity } from '../../model';

@observer
@component({
    tagName: 'edit-activity',
    renderTarget: 'children'
})
export class EditActivity extends mixin() {
    @attribute
    @watch
    name = '';

    connectedCallback() {
        this.classList.add('d-block', 'container-md');

        activity.getOne(this.name);

        super.connectedCallback();
    }

    saveBasicForm = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const form = event.target as HTMLFormElement;
        const data = formToJSON<
            Partial<Omit<Activity, 'tags' | 'description'> & { tags: string }>
        >(form);
        const editor = form.querySelector('html-editor') as HTMLEditor;

        const { display_name } = await activity.updateActivity({
            ...data,
            name: activity.current.name,
            description: editor.value,
            tags: data.tags.split(' ')
        });
        self.alert(`黑客松 ${display_name} 更新成功！`);
    };

    render() {
        const { loading } = activity;

        return (
            <>
                <TabView mode="list" direction="column" className="mt-3">
                    <ListItem>编辑活动</ListItem>
                    <TabPanel>
                        <ActivityBasicForm
                            data={activity.current}
                            onSubmit={this.saveBasicForm}
                        >
                            <Button
                                type="submit"
                                color="success"
                                className="mt-3"
                                disabled={loading}
                            >
                                保存
                            </Button>
                        </ActivityBasicForm>
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
                    <ListItem className="text-nowrap">主办方信息</ListItem>
                    <TabPanel> To implement</TabPanel>
                    <ListItem>公告</ListItem>
                    <TabPanel> To implement</TabPanel>
                </TabView>
            </>
        );
    }
}
