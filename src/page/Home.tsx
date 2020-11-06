import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { MediaObject } from 'boot-cell/source/Content/MediaObject';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';
import { Icon } from 'boot-cell/source/Reminder/Icon';

import { isMobile } from '../utility';
import { ActivityCard, GalleryView } from '../component';
import { activity, user, Activity, User, partner } from '../model';
import style from './Home.module.less';

@observer
@component({
    tagName: 'home-page',
    renderTarget: 'children'
})
export class HomePage extends mixin() {
    connectedCallback() {
        activity.getNextPage({}, true);
        user.getActiveList();

        super.connectedCallback();
    }

    renderTabLatestRelease(list: Activity[]) {
        return (
            <div className="d-flex justify-content-around flex-wrap">
                {list.map(
                    item => item.banners?.[0] && <ActivityCard {...item} />
                )}
            </div>
        );
    }

    renderTabPopular(list: Activity[]) {
        list = list.sort((a, b) =>
            a.stat?.register < b.stat?.register
                ? 1
                : a.stat?.register === b.stat?.register
                ? a.stat?.like < b.stat?.like
                    ? 1
                    : -1
                : -1
        );
        return (
            <div className="d-flex justify-content-around flex-wrap">
                {list.map(
                    item => item.banners?.[0] && <ActivityCard {...item} />
                )}
            </div>
        );
    }

    renderTabUpcoming(list: Activity[]) {
        list = list.sort((a, b) => {
            let a_days = +(
                    (a.registration_end_time - Date.now()) /
                    (1000 * 60 * 60 * 24)
                ).toFixed(0),
                b_days = +(
                    (b.registration_end_time - Date.now()) /
                    (1000 * 60 * 60 * 24)
                ).toFixed(0);
            return a_days < b_days ? 1 : -1;
        });
        return (
            <div className="d-flex justify-content-around flex-wrap">
                {list
                    .filter(item => item.event_start_time > Date.now())
                    .map(
                        item => item.banners?.[0] && <ActivityCard {...item} />
                    )}
            </div>
        );
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

    renderUser = ({ avatar_url, id, nickname, profile }: User) => (
        <MediaObject
            listItem
            image={avatar_url}
            title={<a href={'user?uid=' + id}>{nickname}</a>}
        >
            <p className="text-nowrap">{profile?.career_type}</p>
        </MediaObject>
    );

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
            <div>
                <GalleryView
                    className="container py-3"
                    controls
                    indicators={!isMobile}
                    interval={isMobile ? 0 : 3}
                    list={banner}
                />
                <section className="py-5 bg-light" id="activities">
                    <div className="container d-flex">
                        <TabView mode="pills">
                            <NavLink>最新活动</NavLink>
                            <TabPanel>
                                {this.renderTabLatestRelease(activity.list)}
                            </TabPanel>
                            <NavLink>人气热点</NavLink>
                            <TabPanel>
                                {this.renderTabPopular(activity.list)}
                            </TabPanel>
                            <NavLink>即将开始</NavLink>
                            <TabPanel>
                                {this.renderTabUpcoming(activity.list)}
                            </TabPanel>
                        </TabView>
                    </div>
                    <Button
                        outline
                        block
                        size="sm"
                        className="w-25 m-auto"
                        href="activity/list"
                    >
                        更多活动
                    </Button>
                </section>
                <div className="py-5 container d-flex flex-column flex-md-row align-items-center align-items-md-start">
                    <div id="sponsors">
                        {this.renderLogoSection('赞助伙伴', partner.sponsor)}
                        {this.renderLogoSection('合作主办', partner.host)}
                        <section
                            className="text-center text-md-left"
                            id="activeUsers"
                        >
                            <h5 className={style.userSectionTitle}>活跃用户</h5>

                            <ul className="list-inline">
                                <li className="list-inline-item d-flex flex-wrap justify-content-around">
                                    {user.activeList.map(this.renderUser)}
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>

                <div className={style.vl}>
                    <a
                        href="#activities"
                        class="button"
                        className={style.icons}
                        title={'最新活动'}
                        style={{ textDecoration: 'none', top: '200px' }}
                    >
                        <Icon name="circle-fill" width={20} />
                    </a>
                    <a
                        href="#sponsors"
                        class="button"
                        className={style.icons}
                        title={'赞助合作'}
                        style={{ textDecoration: 'none', top: '270px' }}
                    >
                        <Icon name="circle-fill" width={20} />
                    </a>
                    <a
                        href="#activeUsers"
                        class="button"
                        className={style.icons}
                        title={'活跃用户'}
                        style={{ textDecoration: 'none', top: '340px' }}
                    >
                        <Icon name="circle-fill" width={20} />
                    </a>
                </div>
            </div>
        );
    }
}
