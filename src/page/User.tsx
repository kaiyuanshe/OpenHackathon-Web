import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Button } from 'boot-cell/source/Form/Button';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { BGIcon } from 'boot-cell/source/Reminder/FAIcon';

import { ActivityCard } from '../component';
import { Provider, Registration, user } from '../model';
import style from './User.module.less';

const provider_list = Object.entries(Provider).filter(([key]) => isNaN(+key)),
    provider_link = {
        github: (name: string) => 'https://github.com/' + name,
        qq: (name: string) => 'https://user.qzone.qq.com/' + name,
        weibo: (name: string) => 'https://weibo.com/' + name
    };

@observer
@component({
    tagName: 'user-page',
    renderTarget: 'children'
})
export class UserPage extends mixin() {
    @attribute
    @watch
    uid = '';

    connectedCallback() {
        this.classList.add('container', 'd-block', 'd-lg-flex', 'py-5');
        this.style.background =
            'url(https://hacking.kaiyuanshe.cn/static/pic/profile-back-pattern.png)';

        user.getOne(this.uid);

        super.connectedCallback();
    }

    renderIcon = ([key, name]: string[]) => {
        const { name: userName, provider } = user.current;

        return (
            <a target="_blank" href={provider_link[key]?.(userName)}>
                <BGIcon
                    type="square"
                    kind="brands"
                    name={name}
                    size="lg"
                    color={provider === key ? 'success' : 'secondary'}
                />
            </a>
        );
    };

    renderOwnActivity = ({ hackathon_info }: Registration) => (
        <div className="flex-column">
            <ActivityCard {...hackathon_info} />
            <div className="row justify-content-between">
                <Button
                    outline
                    href="manage/activity"
                    className="col-auto ml-4"
                >
                    编辑活动
                </Button>
                {hackathon_info.status === 3 ? (
                    <Button
                        outline
                        className="col-auto mr-4"
                        onClick={event => event.preventDefault()}
                    >
                        申请下线
                    </Button>
                ) : (
                    <Button
                        outline
                        className="col-auto mr-4"
                        onClick={event => event.preventDefault()}
                    >
                        申请上线
                    </Button>
                )}
            </div>
        </div>
    );

    render() {
        const {
            nickname,
            avatar_url,
            profile,
            likes,
            registrations
        } = user.current;

        return (
            <>
                <div className="border bg-white mr-lg-3 mb-3 mb-lg-0">
                    <header className="p-3">
                        <h2 className="text-nowrap">{nickname}</h2>
                        <div className="d-flex">
                            <img className={style.avatar} src={avatar_url} />
                            <span className="text-nowrap">
                                {profile?.career_type}
                            </span>
                        </div>
                    </header>
                    <div className="p-3 border-top text-nowrap">
                        {provider_list.map(this.renderIcon)}
                    </div>
                    <Button color="success" href="create">
                        创建黑客松
                    </Button>
                    <Button>编辑个人信息</Button>
                </div>
                <TabView mode="masthead" tabAlign="center">
                    <NavLink>关注的活动</NavLink>
                    <TabPanel>
                        <div className="d-flex justify-content-around flex-wrap">
                            {likes?.map(({ hackathon_info }) => (
                                <ActivityCard {...hackathon_info} />
                            ))}
                        </div>
                    </TabPanel>
                    <NavLink>创建的活动</NavLink>
                    <TabPanel>
                        <div className="d-flex justify-content-around flex-wrap">
                            {likes
                                ?.filter(({ remark }) => remark === 'creator')
                                .map(this.renderOwnActivity)}
                        </div>
                    </TabPanel>
                    <NavLink>参与的活动</NavLink>
                    <TabPanel>
                        <div className="d-flex justify-content-around flex-wrap">
                            {registrations?.map(({ hackathon_info }) => (
                                <ActivityCard {...hackathon_info} />
                            ))}
                        </div>
                    </TabPanel>
                </TabView>
            </>
        );
    }
}
