import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { TabList } from 'boot-cell/source/Content/TabList';
import { Icon, BGIcon } from 'boot-cell/source/Reminder/Icon';

import { ActivityCard } from '../component';
import { Provider, user } from '../model';
import style from './User.module.less';

const provider_list = Object.entries(Provider).filter(([key]) => isNaN(+key));

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
        this.classList.add('d-block', 'py-5');
        this.style.background =
            'url(https://hacking.kaiyuanshe.cn/static/pic/profile-back-pattern.png)';

        user.getOne(this.uid);

        super.connectedCallback();
    }

    render() {
        const {
            nickname,
            avatar_url,
            profile,
            provider,
            likes,
            registrations
        } = user.current;

        return (
            <div className="container d-lg-flex">
                <div className="bg-white mr-3">
                    <div className="border p-3">
                        <h2>{nickname}</h2>
                        <div className="d-flex">
                            <img className="pull-left mr-3" src={avatar_url} />
                            <span className="text-nowrap">
                                {profile?.career_type}
                            </span>
                        </div>
                    </div>
                    <div className="border border-top-0 p-3 text-nowrap">
                        {provider_list.map(([key, name]) => (
                            <BGIcon
                                type="square"
                                kind="brands"
                                name={name}
                                size="lg"
                                color={
                                    provider === key ? 'success' : 'secondary'
                                }
                            />
                        ))}
                    </div>
                    <div className="border border-top-0 p-3">
                        <h6>
                            <BGIcon
                                type="square"
                                name="thumbtack"
                                color="secondary"
                            />
                            关注的活动
                        </h6>
                        <ul className="list-unstyled">
                            {likes?.map(
                                ({
                                    hackathon_info: { banners, display_name }
                                }) => (
                                    <li
                                        className={style.picture}
                                        style={{
                                            backgroundImage: `url(${banners[0]})`
                                        }}
                                        title={display_name}
                                    />
                                )
                            )}
                        </ul>
                    </div>
                </div>
                <TabList
                    list={[
                        {
                            title: 'TA 参与的活动',
                            content: (
                                <div
                                    className="border border-top-0 bg-white p-3 d-flex flex-wrap justify-content-around"
                                    style={{ marginTop: '-0.5rem' }}
                                >
                                    {registrations?.map(
                                        ({ hackathon_info }) => (
                                            <ActivityCard {...hackathon_info} />
                                        )
                                    )}
                                </div>
                            )
                        }
                    ]}
                />
            </div>
        );
    }
}
