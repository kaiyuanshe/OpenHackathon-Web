import { component, mixin, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { ActivityCard } from '../../component';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';

import { session, user } from '../../model';
import style from '../User.module.less';

@observer
@component({
    tagName: 'manager-overview',
    renderTarget: 'children'
})
export class ManagerOverview extends mixin() {
    connectedCallback() {
        this.classList.add('d-block', 'py-5');
        this.style.background =
            'url(https://hacking.kaiyuanshe.cn/static/pic/profile-back-pattern.png)';

        user.getOne(session.user.id);
        super.connectedCallback();
    }

    render() {
        const {
            nickname,
            avatar_url,
            profile,
            likes,
            registrations
        } = user.current;
        console.log(likes);
        console.log(registrations);
        return (
            <div className="container d-lg-flex">
                <div className="border bg-white mr-lg-3 mb-3 mb-lg-0">
                    <header className="p-3">
                        <h2>{nickname}</h2>
                        <div className="d-flex">
                            <img className={style.avatar} src={avatar_url} />
                            <span className="text-nowrap">
                                {profile?.career_type}
                            </span>
                        </div>
                    </header>
                    <NavLink href="create">创建黑客松</NavLink>
                    <NavLink>编辑个人信息</NavLink>
                </div>
                <TabView>
                    <NavLink>我关注的活动</NavLink>
                    <TabPanel>
                        <div className="d-flex justify-content-around flex-wrap">
                            {likes?.map(({ hackathon_info }) => (
                                <ActivityCard {...hackathon_info} />
                            ))}
                        </div>
                    </TabPanel>
                    <NavLink>我创建的活动</NavLink>
                    <TabPanel>
                        <div className="d-flex justify-content-around flex-wrap">
                            {likes
                                ?.filter(e => e.remark === 'creator')
                                .map(({ hackathon_info }) => (
                                    <ActivityCard {...hackathon_info} />
                                ))}
                        </div>
                    </TabPanel>
                    <NavLink>我参与的活动</NavLink>
                    <TabPanel>
                        <div className="d-flex justify-content-around flex-wrap">
                            {registrations?.map(({ hackathon_info }) => (
                                <ActivityCard {...hackathon_info} />
                            ))}
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        );
    }
}
