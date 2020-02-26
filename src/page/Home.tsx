import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { TabList } from 'boot-cell/source/Content/TabList';
import { Card } from 'boot-cell/source/Content/Card';

import { activity, Activity } from '../model';

@observer
@component({
    tagName: 'home-page',
    renderTarget: 'children'
})
export class HomePage extends mixin() {
    connectedCallback() {
        activity.getList();
    }

    renderTab(list: Activity[]) {
        return (
            <div className="d-flex justify-content-around flex-wrap">
                {list.map(
                    ({ display_name, short_description, banners }) =>
                        banners?.[0] && (
                            <Card
                                title={display_name}
                                image={banners[0]}
                                className="mb-3"
                                style={{ width: '18rem' }}
                            >
                                {short_description}
                            </Card>
                        )
                )}
            </div>
        );
    }

    render() {
        return (
            <Fragment>
                <section className="d-flex py-5">
                    <div className="d-none d-md-block mr-3">
                        <h2>推荐活动</h2>
                        <img src="https://hacking.kaiyuanshe.cn/static/images/index-07.png" />
                    </div>
                    <TabList
                        list={[
                            {
                                title: '最新发布',
                                content: this.renderTab(activity.list)
                            }
                        ]}
                    />
                </section>
            </Fragment>
        );
    }
}
