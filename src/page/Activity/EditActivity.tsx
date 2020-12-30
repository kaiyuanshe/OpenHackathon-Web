import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { formToJSON } from 'web-utility/source/DOM';
import { observer } from 'mobx-web-cell';
import { Button } from 'boot-cell/source/Form/Button';

import { HTMLEditor } from '../../component/HTMLEditor';
import { ActivityBasicForm } from './ActivityBasicForm';
import { activity, Activity } from '../../model';
import { PageFrame } from '../../component/Navbar';
import menu from './menu.json';

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
            <PageFrame menu={menu}>
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
            </PageFrame>
        );
    }
}
