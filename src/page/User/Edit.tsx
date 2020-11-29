import { component, mixin, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { FileInput } from 'boot-cell/source/Form/FileInput';
import { Button } from 'boot-cell/source/Form/Button';

import { Gender, session } from '../../model';

@component({
    tagName: 'user-edit',
    renderTarget: 'children'
})
export class UserEdit extends mixin() {
    connectedCallback() {
        this.classList.add('d-block', 'py-5');
        this.style.background =
            'url(https://hacking.kaiyuanshe.cn/static/pic/profile-back-pattern.png)';

        super.connectedCallback();
    }

    handleSave = (event: Event) => {
        event.preventDefault(), event.stopPropagation();
    };

    render() {
        const {
            avatar_url,
            nickname,
            phone,
            profile: { gender = Gender.other, age = 0, address = '' } = {}
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
                        <FileInput name="avatar_url" value={avatar_url} />
                    </FormField>
                    <FormField
                        className="col-md-6"
                        label="姓名"
                        name="nickname"
                        required
                        value={nickname}
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
                            value={Gender.female}
                            selected={gender === Gender.female}
                        >
                            女
                        </option>
                        <option
                            value={Gender.male}
                            selected={gender === Gender.male}
                        >
                            男
                        </option>
                        <option
                            value={Gender.other}
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
                        min={0}
                        value={age + ''}
                    />
                </div>
                <div className="form-row">
                    <div className="col-md-6 my-2 my-md-0">
                        <Button block type="submit">
                            保存
                        </Button>
                    </div>
                    <div className="col-md-6">
                        <Button block type="reset" color="danger">
                            取消
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}
