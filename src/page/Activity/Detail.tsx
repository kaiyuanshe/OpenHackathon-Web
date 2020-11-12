import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { diffTime } from 'web-utility/source/date';

import { Badge } from 'boot-cell/source/Reminder/Badge';
import { FAIcon } from 'boot-cell/source/Reminder/FAIcon';
import { ListGroup, ListItem } from 'boot-cell/source/Content/ListGroup';
import { CarouselView, CarouselItem } from 'boot-cell/source/Media/Carousel';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { MediaObject } from 'boot-cell/source/Content/MediaObject';
import { Embed } from 'boot-cell/source/Media/Embed';

import style from './Detail.module.less';
import { TimeUnitName, isMobile } from '../../utility';
import { activity } from '../../model';

@observer
@component({
    tagName: 'activity-detail',
    renderTarget: 'children'
})
export class ActivityDetail extends mixin() {
    @attribute
    @watch
    name = '';

    connectedCallback() {
        this.classList.add('d-block', 'container');

        activity.getOne(this.name);

        super.connectedCallback();
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
                        <Badge color="success" className="mr-1">
                            {tag}
                        </Badge>
                    ))}
                </aside>
                <ul className="list-unstyled">
                    <li>
                        报名时间
                        <FAIcon
                            name="calendar-alt"
                            color="success"
                            className="mx-2"
                        />
                        {new Date(registration_start_time).toLocaleString()} ~{' '}
                        {new Date(registration_end_time).toLocaleString()}
                    </li>
                    <li>
                        活动时间
                        <FAIcon
                            name="calendar-alt"
                            color="success"
                            className="mx-2"
                        />
                        {new Date(event_start_time).toLocaleString()} ~{' '}
                        {new Date(event_end_time).toLocaleString()}
                    </li>
                    <li>
                        活动地址
                        <FAIcon
                            name="map-marker-alt"
                            color="success"
                            className="mx-2"
                        />
                        {location}
                    </li>
                    <li>
                        报名人数
                        <FAIcon name="users" color="success" className="mx-2" />
                        {stat?.register}人
                    </li>
                </ul>
            </div>
        );
    }

    renderEventList() {
        const { events = [] } = activity.current;

        return (
            <ListGroup key="news" flush>
                {events.map(({ create_time, link, content }) => {
                    const date = new Date(create_time);
                    const { distance, unit } = diffTime(date);

                    return (
                        <ListItem
                            className="d-flex align-items-center"
                            href={link}
                        >
                            <time datetime={date.toJSON()}>
                                {Math.abs(distance)} {TimeUnitName[unit]}前
                            </time>
                            <Badge color="primary" className="mx-2">
                                <FAIcon name="volume-down" size={2} />
                            </Badge>
                            {content}
                        </ListItem>
                    );
                })}
            </ListGroup>
        );
    }

    renderTeamList() {
        const { teams = [], name: hackathon } = activity.current;

        return (
            <ol className="list-unstyled d-flex flex-wrap justify-content-around">
                {teams.map(
                    ({
                        logo,
                        id: tid,
                        name,
                        member_count,
                        leader: { id, avatar_url, nickname }
                    }) => (
                        <li
                            className="border overflow-hidden mb-3"
                            style={{ width: '200' }}
                        >
                            <div className="d-flex border-bottom">
                                <img className={style.logo} src={logo} />
                                <div className="flex-shrink-1">
                                    <h4 className="text-nowrap my-1">
                                        <a
                                            href={`team?activity=${hackathon}&tid=${tid}`}
                                        >
                                            {name}
                                        </a>
                                    </h4>
                                    共{' '}
                                    <span className="text-success">
                                        {member_count}
                                    </span>{' '}
                                    人
                                </div>
                            </div>
                            <div className="p-2">
                                队长：
                                <a href={'user?uid=' + id}>
                                    <img
                                        className={style.icon}
                                        src={avatar_url}
                                    />{' '}
                                    {nickname}
                                </a>
                            </div>
                        </li>
                    )
                )}
            </ol>
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
            <div>
                <header className="d-lg-flex py-3">
                    <CarouselView controls indicators={!isMobile}>
                        {banners?.map(image => (
                            <CarouselItem image={image} />
                        ))}
                    </CarouselView>
                    {this.renderMeta()}
                </header>
                <div className="d-lg-flex">
                    <TabView>
                        <NavLink>活动详情</NavLink>
                        <TabPanel innerHTML={description} />

                        <NavLink>最新动态</NavLink>
                        <TabPanel>{this.renderEventList()}</TabPanel>

                        <NavLink>所有团队</NavLink>
                        <TabPanel>{this.renderTeamList()}</TabPanel>
                    </TabView>
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
                        <Embed
                            is="iframe"
                            style={{ height: '20rem' }}
                            scrolling="no"
                            src={`//uri.amap.com/marker?src=OHP&callnative=1&position=${coord?.longitude},${coord?.latitude}&name=${location}`}
                        />
                    </aside>
                </div>
            </div>
        );
    }
}
