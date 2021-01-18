import {
    WebCellProps,
    component,
    mixin,
    watch,
    attribute,
    createCell
} from 'web-cell';
import { formToJSON } from 'web-utility/source/DOM';
import { observer } from 'mobx-web-cell';
import { Button } from 'boot-cell/source/Form/Button';

import { AdminFrame } from '../../component/AdminFrame';
import { ActivityBasicForm } from './ActivityBasicForm';
import menu from './menu.json';
import { activity, Activity } from '../../model';

export interface EditActivityProps extends WebCellProps {
    name: string;
}

@observer
@component({
    tagName: 'edit-activity',
    renderTarget: 'children'
})
export class EditActivity extends mixin<EditActivityProps>() {
    @attribute
    @watch
    name = '';

    connectedCallback() {
        activity.getOne(this.name);

        super.connectedCallback();
    }

    saveBasicForm = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const form = event.target as HTMLFormElement;
        const data = formToJSON<
            Partial<Omit<Activity, 'tags' | 'description'> & { tags: string }>
        >(form);

        const { display_name } = await activity.updateActivity({
            ...data,
            name: activity.current.name,
            tags: data.tags.split(' ')
        });
        self.alert(`黑客松 ${display_name} 更新成功！`);
    };

    render({ name }: EditActivityProps) {
        const { loading } = activity;

        return (
            <AdminFrame menu={menu} name={name}>
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
            </AdminFrame>
        );
    }
}
