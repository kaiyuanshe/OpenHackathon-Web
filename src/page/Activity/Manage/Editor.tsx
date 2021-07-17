import {
    WebCellProps,
    component,
    mixin,
    watch,
    attribute,
    createCell
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Button } from 'boot-cell/source/Form/Button';

import { AdminFrame } from '../../../component/AdminFrame';
import { ActivityBasicForm } from './BasicForm';
import menu from './menu.json';
import { activity } from '../../../model';

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

    render({ name }: EditActivityProps) {
        const { loading, current } = activity;

        return (
            <AdminFrame menu={menu} name={name}>
                <ActivityBasicForm
                    data={{ ...current, id: current.name }}
                    onSubmit={({ displayName }) =>
                        self.alert(`黑客松 ${displayName} 更新成功！`)
                    }
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
