import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { MediaObject } from 'boot-cell/source/Content/MediaObject';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';
import { Image } from 'boot-cell/source/Media/Image';

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
                <div className="row text-center">
                    <div className="col col-md-5">
                        <hr
                            style={{
                                backgroundColor: '#00AD1C',
                                height: '1px',
                                width: '100%'
                            }}
                        />
                    </div>
                    <div className="col col-md-2">
                        <h5>{title}</h5>
                    </div>
                    <div className="col col-md-5">
                        <hr
                            style={{
                                backgroundColor: '#00AD1C',
                                height: '1px',
                                width: '100%'
                            }}
                        />
                    </div>
                </div>
                <ul className="list-inline">
                    {list.map(({ url, name, logo }) => (
                        <li className="list-inline-item mb-3">
                            <a
                                className={style.logo}
                                target="_blank"
                                href={url}
                                title={name}
                            >
                                <div
                                    style={{
                                        width: '165px',
                                        height: '80px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img
                                        src={logo}
                                        style={{
                                            margin: '-25% 0 0 0',
                                            width: '162px',
                                            height: '162px'
                                        }}
                                    />
                                </div>
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
                        <section className="text-center text-md-left">
                            <div className="row">
                                <div className="col-2">
                                    <h4>活跃用户</h4>
                                </div>
                                <div className="col-10">
                                    <hr
                                        style={{
                                            backgroundColor: '#FD8900',
                                            height: '1px',
                                            width: '100%'
                                        }}
                                    />
                                </div>
                            </div>
                            <ul className="list-inline">
                                <li className="list-inline-item d-flex flex-wrap justify-content-around">
                                    {user.activeList.map(this.renderUser)}
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
