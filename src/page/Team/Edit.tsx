import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { BreadCrumb } from 'boot-cell/source/Navigator/BreadCrumb';
import { Form } from 'boot-cell/source/Form/Form';
import { FormField } from 'boot-cell/source/Form/FormField';
import { ToggleField } from 'boot-cell/source/Form/ToggleField';
import { Button } from 'boot-cell/source/Form/Button';
import { formToJSON } from 'web-utility/source/DOM';
import { activity, Team } from '../../model';

@observer
@component({
    tagName: 'team-edit',
    renderTarget: 'children'
})
export class TeamEdit extends mixin() {
    @attribute
    @watch
    activity = '';

    @attribute
    @watch
    tid = '';

    async connectedCallback() {
        this.classList.add('d-block', 'py-4', 'bg-light');

        super.connectedCallback();

        if (this.activity !== activity.current.name)
            await activity.getOne(this.activity);

        if (this.tid)
            await activity.team.getOne(this.tid);
    }

    saveTeam = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const form = event.target as HTMLFormElement;
        const data = formToJSON<Team>(form);

        const operation = this.tid ? '更新' : '创建'
        try {
            const { id } = await activity.team.updateOne(this.tid, data);
            if(!this.tid)
                this.tid = id
            self.alert(`团队${operation}成功！`);    
        }
        catch(err) {
            let detail = err && err.body && err.body.detail
            self.alert(detail || `团队${operation}失败！`)
        }
    };

    render() {
        const { displayName: hackathonDisplayName, name: hackathonName } = activity.current;
        const {
            displayName,
            description,
            autoApprove
        } = (activity.team && activity.team.current) || {}
        const loading = activity.loading || (activity.team && activity.team.loading);

        return (
            <SpinnerBox className="container" cover={loading}>
                <BreadCrumb
                    path={[
                        {
                            title: hackathonDisplayName,
                            href: 'activity?name=' + hackathonName
                        },
                        { title: displayName || '创建团队'}
                    ]}
                />
                <div className="d-lg-flex">
                    <div className="border bg-white flex-fill">
                        <div className="p-3">
                            <Form onSubmit={this.saveTeam}>
                                <FormField
                                    label="团队名称"
                                    name="displayName"
                                    labelColumn={2}
                                    placeholder="团队名称"
                                    value={displayName}
                                    required
                                />
                                <FormField
                                    label="团队介绍"
                                    name="description"
                                    labelColumn={2}
                                    placeholder="团队介绍"
                                    value={description}
                                    required
                                />
                                <ToggleField
                                    type="checkbox"
                                    switch
                                    className="m-2"
                                    name="autoApprove"
                                    checked={autoApprove}
                                >
                                    自动通过
                                    <span>（申请加入团队的人无需团队管理员批准，自动成为团队成员。）</span>
                                </ToggleField>
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="mt-3"
                                    disabled={loading}
                                >
                                    保存
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </SpinnerBox>
        );
    }
}
