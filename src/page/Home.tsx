import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { MediaObject } from 'boot-cell/source/Content/MediaObject';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';

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

    renderTabStarting(list: Activity[]) {
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
                <h2>{title}</h2>
                <ul className="list-inline">
                    {list.map(({ url, name, logo }) => (
                        <li className="list-inline-item">
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
                <section className="py-5 bg-light">
                    <div className="container d-flex">
                        <div className="d-none d-md-block mr-3">
                            <h2>推荐活动</h2>
                            <img src="https://hacking.kaiyuanshe.cn/static/images/index-07.png" />
                        </div>
                        <TabView mode="pills">
                            <NavLink>最新发布</NavLink>
                            <TabPanel>
                                {this.renderTabLatestRelease(activity.list)}
                            </TabPanel>
                            <NavLink>人气热点</NavLink>
                            <TabPanel>
                                {this.renderTabPopular(activity.list)}
                            </TabPanel>
                            <NavLink>即将开始</NavLink>
                            <TabPanel>
                                {this.renderTabStarting(activity.list)}
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
                    <div>
                        {this.renderLogoSection('赞助伙伴', partner.sponsor)}
                        {this.renderLogoSection('合作主办', partner.host)}
                    </div>
                    <section>
                        <h2 className="text-center text-md-left">活跃用户</h2>
                        <ol className="list-unstyled d-md-block d-flex flex-wrap justify-content-around">
                            {user.activeList.map(this.renderUser)}
                        </ol>
                    </section>
                </div>
            </div>
        );
    }
}
