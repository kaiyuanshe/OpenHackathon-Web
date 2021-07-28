import { component, mixin, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { ActivityGallery } from '../../component';
import { AdminFrame, AdminFrameProps } from '../../component/AdminFrame';
import { ownActivity } from '../../model';

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

        ownActivity.getNextPage({ listType: 'admin' }, true);
    }

    render() {
        const { list } = ownActivity;

        return (
            <AdminFrame menu={this.menu}>
                <ActivityGallery
                    manage
                    list={list}
                    onPublish={name => ownActivity.publishOne(name, true)}
                    onDelete={name =>
                        self.confirm(`确定删除 ${name}？`) &&
                        ownActivity.deleteOne(name)
                    }
                />
            </AdminFrame>
        );
    }
}
