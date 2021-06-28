import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { textJoin } from 'web-utility/source/i18n';
import { diffTime } from 'web-utility/source/date';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Badge } from 'boot-cell/source/Reminder/Badge';
import { FAIcon } from 'boot-cell/source/Reminder/FAIcon';
import { ListGroup, ListItem } from 'boot-cell/source/Content/ListGroup';
import { CarouselView, CarouselItem } from 'boot-cell/source/Media/Carousel';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { MediaObject } from 'boot-cell/source/Content/MediaObject';
import { Embed } from 'boot-cell/source/Media/Embed';
import { Button } from 'boot-cell/source/Form/Button';

import style from './Detail.module.less';
import { TimeUnitName, isMobile } from '../../utility';
import { words } from '../../i18n';
import { activity, RegistrationStatus, Team } from '../../model';

@observer
@component({
    tagName: 'activity-detail',
    renderTarget: 'children'
})
export class ActivityDetail extends mixin() {
    @attribute
    @watch
    name = '';

    async connectedCallback() {
        this.classList.add('d-block', 'container');

        super.connectedCallback();

        await activity.getOne(this.name);
        await activity.team.getNextPage({}, true);
    }

    handleRegister = async () => {
        const { status } = await activity.registration.createOne();

        if (status === RegistrationStatus.approved) return activity.getOne();

        self.alert(
            textJoin(
                words.hackathons,
                this.name,
                words.registration_needs_review
            )
        );
    };

    renderMeta() {
        const {
            name,
            displayName,
            tags,
            enrollmentStartedAt,
            enrollmentEndedAt,
            eventStartedAt,
            eventEndedAt,
            location,
            roles,
            stat
        } = activity.current;

        return (
            <>
                <h2 className="my-3">{displayName}</h2>
                <aside className="my-2">
                    {tags?.map(tag => (
                        <Badge color="success" className="mr-1">
                            {tag}
                        </Badge>
                    ))}
                </aside>
                <ul className="list-unstyled">
                    <li>
                        {textJoin(words.register, words.period)}
                        <FAIcon
                            name="calendar-alt"
                            color="success"
                            className="mx-2"
                        />
                        {new Date(enrollmentStartedAt).toLocaleString()} ~{' '}
                        {new Date(enrollmentEndedAt).toLocaleString()}
                    </li>
                    <li>
                        {textJoin(words.event, words.period)}
                        <FAIcon
                            name="calendar-alt"
                            color="success"
                            className="mx-2"
                        />
                        {new Date(eventStartedAt).toLocaleString()} ~{' '}
                        {new Date(eventEndedAt).toLocaleString()}
                    </li>
                    <li>
                        {textJoin(words.event, words.address)}
                        <FAIcon
                            name="map-marker-alt"
                            color="success"
                            className="mx-2"
                        />
                        {location}
                    </li>
                    <li>
                        {words.registration_count}
                        <FAIcon name="users" color="success" className="mx-2" />
                        {textJoin((stat?.register || 0) + '', words.people)}
                    </li>
                </ul>
                {!roles?.isEnrolled ? (
                    <Button color="success" onClick={this.handleRegister}>
                        {words.register}
                    </Button>
                ) : !roles?.isJudge ? (
                    <Button color="primary" href={`team/edit?activity=${name}`}>
                        {textJoin(words.create, words.team)}
                    </Button>
                ) : null}
            </>
        );
    }

    renderEventList() {
        const { events = [] } = activity.current;

        return (
            <ListGroup key="news" flush>
                {events.map(({ createdAt, link, content }) => {
                    const date = new Date(createdAt);
                    const { distance, unit } = diffTime(date);

                    return (
                        <ListItem
                            className="d-flex align-items-center"
                            href={link}
                        >
                            <time dateTime={date.toJSON()}>
                                {textJoin(
                                    Math.abs(distance) + '',
                                    TimeUnitName[unit],
                                    words.before
                                )}
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

    renderTeam = ({
        hackathonName,
        logo,
        id,
        displayName,
        member_count,
        leader
    }: Team) => (
        <li className="border overflow-hidden mb-3" style={{ width: '200' }}>
            <div className="d-flex border-bottom">
                <img className={style.logo} src={logo} />
                <div className="flex-shrink-1">
                    <h4 className="text-nowrap my-1">
                        <a href={`team?activity=${hackathonName}&tid=${id}`}>
                            {displayName}
                        </a>
                    </h4>
                    {words.a_total_of}
                    <span className="mx-2 text-success">{member_count}</span>
                    {words.people}
                </div>
            </div>
            <div className="p-2">
                {words.team_leader}：
                <a href={'user?uid=' + leader?.id}>
                    <img className={style.icon} src={leader?.phone} />{' '}
                    {leader?.nickname}
                </a>
            </div>
        </li>
    );

    render() {
        const {
            loading,
            current: { banners, location, organizers, detail, coord },
            team
        } = activity;

        return (
            <SpinnerBox cover={loading}>
                <header className="row py-3">
                    <CarouselView
                        className="col-12 col-lg-7"
                        controls
                        indicators={!isMobile}
                    >
                        {banners?.map(image => (
                            <CarouselItem image={image.uri} />
                        ))}
                    </CarouselView>
                    <div className="col-12 col-lg-5">{this.renderMeta()}</div>
                </header>
                <div className="row">
                    <TabView className="col-12 col-lg-9">
                        <NavLink>{words.hackathon_detail}</NavLink>
                        <TabPanel innerHTML={detail} />

                        <NavLink>{words.latest_news}</NavLink>
                        <TabPanel>{this.renderEventList()}</TabPanel>

                        <NavLink>{words.all_teams}</NavLink>
                        <TabPanel>
                            <ol className="list-unstyled d-flex flex-wrap justify-content-around">
                                {team?.list.map(this.renderTeam)}
                            </ol>
                        </TabPanel>
                    </TabView>
                    <aside className="col-12 col-lg-3">
                        <h3>{words.organizer}</h3>
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
                        {location && (
                            <>
                                <h3 className="mt-3">{words.event_location}</h3>
                                <Embed
                                    is="iframe"
                                    style={{ height: '20rem' }}
                                    scrolling="no"
                                    src={`//uri.amap.com/marker?src=OHP&callnative=1&position=${coord?.longitude},${coord?.latitude}&name=${location}`}
                                />
                            </>
                        )}
                    </aside>
                </div>
            </SpinnerBox>
        );
    }
}
