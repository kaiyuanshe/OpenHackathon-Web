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
import { Button } from 'boot-cell/source/Form/Button';
import { observer } from 'mobx-web-cell';

import { ActivityBasicForm } from './ActivityBasicForm';
import { activity, Activity } from '../../model';
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
            name: activity.current.name,
            description: this.description.root.innerHTML,
            tags: data.tags.split(' ')
        });
    };

    renderBasicForm() {
        return (
            <form className="text-center" onSubmit={this.saveBasicForm}>
                <ActivityBasicForm {...activity.current} />
                <div
                    ref={(box: HTMLElement) => {
                        box.innerHTML = activity.current.description;
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
