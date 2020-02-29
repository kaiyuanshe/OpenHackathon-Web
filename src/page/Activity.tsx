import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Badge } from 'boot-cell/source/Reminder/Badge';
import { Icon } from 'boot-cell/source/Reminder/Icon';
import { CarouselView } from 'boot-cell/source/Content/Carousel';
import { TabList } from 'boot-cell/source/Content/TabList';
import { MediaObject } from 'boot-cell/source/Content/MediaObject';

import { activity } from '../model';

@observer
@component({
    tagName: 'activity-page',
    renderTarget: 'children'
})
export class ActivityPage extends mixin() {
    @attribute
    @watch
    name = '';

    connectedCallback() {
        activity.getOne(this.name);
    }

    renderMeta() {
        const {
            display_name,
            tags,
            registration_start_time,
            registration_end_time,
            event_start_time,
            event_end_time,
            location,
            stat
        } = activity.current;

        return (
            <div className="ml-3">
                <h2 className="my-3">{display_name}</h2>
                <aside className="my-2">
                    {tags?.map(tag => (
                        <Badge kind="success" className="mr-1">
                            {tag}
                        </Badge>
                    ))}
                </aside>
                <ul className="list-unstyled">
                    <li>
                        报名时间
                        <Icon
                            name="calendar-alt"
                            className="mx-2 text-success"
                        />
                        {new Date(registration_start_time).toLocaleString()} ~{' '}
                        {new Date(registration_end_time).toLocaleString()}
                    </li>
                    <li>
                        活动时间
                        <Icon
                            name="calendar-alt"
                            className="mx-2 text-success"
                        />
                        {new Date(event_start_time).toLocaleString()} ~{' '}
                        {new Date(event_end_time).toLocaleString()}
                    </li>
                    <li>
                        活动地址
                        <Icon
                            name="map-marker-alt"
                            className="mx-2 text-success"
                        />
                        {location}
                    </li>
                    <li>
                        报名人数
                        <Icon name="users" className="mx-2 text-success" />
                        {stat?.register}人
                    </li>
                </ul>
            </div>
        );
    }

    render() {
        const {
            banners,
            location,
            organizers,
            description,
            coord
        } = activity.current;

        return (
            <div className="container">
                <header className="d-lg-flex py-3">
                    <CarouselView
                        indicators
                        list={banners?.map(image => ({ image }))}
                    />
                    {this.renderMeta()}
                </header>
                <div className="d-lg-flex">
                    <TabList
                        list={[
                            {
                                title: '活动详情',
                                content: <div innerHTML={description} />
                            }
                        ]}
                    />
                    <aside className="ml-3">
                        <h3>主办方</h3>
                        {organizers?.map(({ logo, name, homepage }) => (
                            <MediaObject
                                className="border p-3"
                                image={logo}
                                title={
                                    <a
                                        className="text-nowrap"
                                        target="_blank"
                                        href={homepage}
                                    >
                                        {name}
                                    </a>
                                }
                            />
                        ))}
                        <h3 className="mt-3">活动地点</h3>
                        <iframe
                            className="border-0 w-100"
                            style={{ height: '20rem' }}
                            scrolling="no"
                            lazyload="1"
                            loading="lazy"
                            src={`//uri.amap.com/marker?src=OHP&callnative=1&position=${coord?.longitude},${coord?.latitude}&name=${location}`}
                        />
                    </aside>
                </div>
            </div>
        );
    }
}
