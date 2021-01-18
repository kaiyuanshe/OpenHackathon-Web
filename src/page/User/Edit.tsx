import { component, mixin, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { formToJSON } from 'web-utility/source/DOM';
import { FormField } from 'boot-cell/source/Form/FormField';
import { FileInput } from 'boot-cell/source/Form/FileInput';
import { Button } from 'boot-cell/source/Form/Button';

import { Gender, session, UserProfile } from '../../model';

@observer
@component({
    tagName: 'user-edit',
    renderTarget: 'children'
})
export class UserEdit extends mixin() {
    connectedCallback() {
        this.classList.add('d-block', 'py-5');
        this.style.background =
            'url(https://hacking.kaiyuanshe.cn/static/pic/profile-back-pattern.png)';

        session.getUser();

        super.connectedCallback();
    }

    handleSave = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const { avatar, phone, ...data } = formToJSON<
            Partial<{ avatar: File | string } & UserProfile>
        >(event.target as HTMLFormElement);

        await session.updateProfile({
            avatar: avatar instanceof File ? avatar : null,
            phone: phone + '',
            ...data
        });
        self.alert('个人信息更新成功！');
    };

    render() {
        const { loading } = session;
        const {
            avatar_url,
            profile: {
                real_name = '',
                phone = '',
                gender = Gender.other,
                age = 1,
                address = ''
            } = {}
        } = session.user || {};

        return (
            <form
                className="container border rounded bg-white p-4"
                onSubmit={this.handleSave}
                onReset={() => history.back()}
            >
                <h2>个人信息</h2>

                <div className="form-row">
                    <FormField className="col-md-6" label="头像">
                        <FileInput name="avatar" value={avatar_url} />
                    </FormField>
                    <FormField
                        className="col-md-6"
                        label="姓名"
                        name="real_name"
                        required
                        value={real_name}
                    />
                </div>
                <div className="form-row">
                    <FormField
                        className="col-md-6"
                        label="手机号"
                        type="tel"
                        name="phone"
                        required
                        value={phone}
                    />
                    <FormField
                        className="col-md-6"
                        label="邮寄地址"
                        placeholder="用于奖品寄送"
                        name="address"
                        required
                        value={address}
                    />
                </div>
                <div className="form-row">
                    <FormField
                        className="col-md-6"
                        label="性别"
                        is="select"
                        name="gender"
                    >
                        <option
                            value={Gender.female + ''}
                            selected={gender === Gender.female}
                        >
                            女
                        </option>
                        <option
                            value={Gender.male + ''}
                            selected={gender === Gender.male}
                        >
                            男
                        </option>
                        <option
                            value={Gender.other + ''}
                            selected={gender === Gender.other}
                        >
                            其它
                        </option>
                    </FormField>
                    <FormField
                        className="col-md-6"
                        label="年龄"
                        type="number"
                        name="age"
                        min="1"
                        value={age + ''}
                    />
                </div>
                <div className="form-row">
                    <div className="col-md-6 my-2 my-md-0">
                        <Button
                            type="submit"
                            color="success"
                            block
                            disabled={loading}
                        >
                            保存
                        </Button>
                    </div>
                    <div className="col-md-6">
                        <Button
                            type="reset"
                            color="danger"
                            block
                            disabled={loading}
                        >
                            取消
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}
