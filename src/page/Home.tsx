import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { TabList } from 'boot-cell/source/Content/TabList';
import { Card } from 'boot-cell/source/Content/Card';
import { Icon } from 'boot-cell/source/Reminder/Icon';

import { activity, Activity } from '../model';
import { GalleryView } from '../component';

@observer
@component({
    tagName: 'home-page',
    renderTarget: 'children'
})
export class HomePage extends mixin() {
    connectedCallback() {
        activity.getList();
    }

    renderCard({
        display_name,
        banners,
        event_start_time,
        location,
        tags,
        registration_end_time,
        stat: { like, register }
    }: Activity) {
        const event_start = new Date(event_start_time),
            days = +(
                (registration_end_time - Date.now()) /
                (1000 * 60 * 60 * 24)
            ).toFixed(0);

        return (
            <Card
                className="mb-3"
                style={{ width: '18rem' }}
                title={display_name}
                image={banners[0]}
            >
                <small className="d-flex justify-content-between">
                    <time datetime={event_start.toJSON()}>
                        <Icon name="calendar-alt" className="text-success" />{' '}
                        {event_start.toLocaleString()}
                    </time>
                    <span>
                        <Icon name="map-marker-alt" className="text-success" />{' '}
                        {location.split(' ')[0]}
                    </span>
                </small>
                <hr />
                <ul className="list-inline text-success">
                    {tags.map(tag => (
                        <li class="list-inline-item">
                            <small>{tag}</small>
                        </li>
                    ))}
                </ul>
                <small className="d-flex justify-content-between">
                    <time datetime={new Date(registration_end_time).toJSON()}>
                        报名截止 {days < 0 ? '--' : days} 天
                    </time>
                    <span>
                        <Icon name="heart" className="text-danger" /> {like}
                    </span>
                    <span>{register}人报名</span>
                </small>
            </Card>
        );
    }

    renderTab(list: Activity[]) {
        return (
            <div className="d-flex justify-content-around flex-wrap">
                {list.map(item => item.banners?.[0] && this.renderCard(item))}
            </div>
        );
    }

    render() {
        const banner = activity.list
            .filter(({ banners }) => banners?.[0])
            .slice(0, 3)
            .map(({ display_name, banners, ribbon }) => ({
                title: display_name,
                image: banners[0],
                detail: ribbon
            }));

        return (
            <Fragment>
                <GalleryView
                    className="container py-3"
                    interval={3}
                    list={banner}
                />
                <section className="py-5 bg-light">
                    <div className="container d-flex">
                        <div className="d-none d-md-block mr-3">
                            <h2>推荐活动</h2>
                            <img src="https://hacking.kaiyuanshe.cn/static/images/index-07.png" />
                        </div>
                        <TabList
                            mode="pills"
                            list={[
                                {
                                    title: '最新发布',
                                    content: this.renderTab(activity.list)
                                }
                            ]}
                        />
                    </div>
                </section>
            </Fragment>
        );
    }
}
