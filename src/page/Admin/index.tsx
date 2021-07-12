import { component, mixin, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { ActivityGallery } from '../../component';
import { AdminFrame, AdminFrameProps } from '../../component/AdminFrame';
import { activity } from '../../model';

@observer
@component({
    tagName: 'admin-page',
    renderTarget: 'children'
})
export class AdminPage extends mixin() {
    menu: AdminFrameProps['menu'] = [
        {
            title: '运营管理',
            list: [
                {
                    title: '活动管理',
                    icon: 'calendar-week',
                    href: 'admin'
                }
            ]
        }
    ];

    connectedCallback() {
        super.connectedCallback();

        activity.getNextPage({ listType: 'admin' }, true);
    }

    render() {
        const { list } = activity;

        return (
            <AdminFrame menu={this.menu}>
                <ActivityGallery
                    manage
                    list={list}
                    onPublish={name => activity.publishOne(name, true)}
                    onDelete={name =>
                        self.confirm(`确定删除 ${name}？`) &&
                        activity.deleteOne(name)
                    }
                />
            </AdminFrame>
        );
    }
}
