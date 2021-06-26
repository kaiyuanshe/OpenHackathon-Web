import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { MediaObject } from 'boot-cell/source/Content/MediaObject';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';
import { Icon } from 'boot-cell/source/Reminder/Icon';

import { isMobile } from '../../utility';
import { i18nTextOf } from '../../i18n';
import { ActivityGallery, GalleryView } from '../../component';
import { activity, user, Activity, User, partner } from '../../model';
import style from './index.module.less';

@observer
@component({
    tagName: 'home-page',
    renderTarget: 'children'
})
export class HomePage extends mixin() {
    connectedCallback() {
        activity.getNextPage({ listType: 'fresh' }, true);
        // user.getActiveList();

        super.connectedCallback();
    }

    renderTabUpcoming(list: Activity[]) {
        const now = Date.now();

        list = list
            .filter(({ eventStartedAt: start }) => +new Date(start) > now)
            .sort(
                ({ enrollmentEndedAt: A }, { enrollmentEndedAt: B }) =>
                    +new Date(B) - +new Date(A)
            );
        return <ActivityGallery list={list} />;
    }

    renderLogoSection(title: string, list: typeof partner.host) {
        return (
            <section className="text-center text-md-left">
                <h5 className={style.logoSectionTitle}>{title}</h5>

                <ul className="list-inline">
                    {list.map(({ url, name, logo }) => (
                        <li className="list-inline-item mb-3">
                            <a
                                className={style.logo}
                                target="_blank"
                                href={url}
                                title={name}
                            >
                                <img src={logo} />
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        );
    }

    renderUser = ({ photo, id, nickname }: User) => (
        <MediaObject
            className="position-relative"
            image={photo}
            title={
                <a
                    className="stretched-link text-nowrap"
                    href={'user?uid=' + id}
                >
                    {nickname}
                </a>
            }
        />
    );

    render() {
        const { list, loading } = activity;
        const banner = list
                .filter(({ banners }) => banners?.[0])
                .slice(0, 3)
                .map(({ displayName, banners, ribbon }) => ({
                    title: displayName,
                    image: banners[0]?.uri,
                    detail: ribbon
                })),
            popular_activities = [...list].sort(
                ({ stat: a }, { stat: b }) =>
                    b?.register - a?.register || b?.like - a?.like
            );

        return (
            <>
                <GalleryView
                    className="container py-3"
                    controls
                    indicators={!isMobile}
                    interval={isMobile ? 0 : 3}
                    list={banner}
                />
                <section className="py-5 bg-light" id="activities">
                    <SpinnerBox className="container d-flex" cover={loading}>
                        <TabView mode="pills">
                            <NavLink>{i18nTextOf('last_events')}</NavLink>
                            <TabPanel>
                                <ActivityGallery list={list} />
                            </TabPanel>
                            <NavLink>{i18nTextOf('most_popular')}</NavLink>
                            <TabPanel>
                                <ActivityGallery list={popular_activities} />
                            </TabPanel>
                            <NavLink>{i18nTextOf('upcoming_events')}</NavLink>
                            <TabPanel>{this.renderTabUpcoming(list)}</TabPanel>
                        </TabView>
                    </SpinnerBox>
                    <Button
                        outline
                        color="primary"
                        block
                        size="sm"
                        className="w-25 m-auto"
                        href="activity/list"
                    >
                        {i18nTextOf('more_events')}
                    </Button>
                </section>
                <div className="py-5 container d-flex flex-column flex-md-row align-items-center align-items-md-start">
                    <div id="sponsors">
                        {this.renderLogoSection(
                            i18nTextOf('sponsors'),
                            partner.sponsor
                        )}
                        {this.renderLogoSection(
                            i18nTextOf('partners'),
                            partner.host
                        )}
                        <section
                            className="text-center text-md-left"
                            id="activeUsers"
                        >
                            <h5 className={style.userSectionTitle}>
                                {i18nTextOf('active_users')}
                            </h5>
                            <div className="d-flex flex-wrap justify-content-around">
                                {user.activeList.map(this.renderUser)}
                            </div>
                        </section>
                    </div>
                </div>

                <div className={style.vl}>
                    <a
                        href="#activities"
                        className={style.icons}
                        title={i18nTextOf('last_events')}
                        style={{ top: '-10px' }}
                    >
                        <Icon name="circle-fill" size={1.25} />
                    </a>
                    <a
                        href="#sponsors"
                        className={style.icons}
                        title={i18nTextOf('sponsors')}
                        style={{ top: '60px' }}
                    >
                        <Icon name="circle-fill" size={1.25} />
                    </a>
                    <a
                        href="#activeUsers"
                        className={style.icons}
                        title={i18nTextOf('active_users')}
                        style={{ top: '130px' }}
                    >
                        <Icon name="circle-fill" size={1.25} />
                    </a>
                </div>
            </>
        );
    }
}
