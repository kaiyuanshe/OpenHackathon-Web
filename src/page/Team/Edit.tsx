import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { textJoin } from 'web-utility/source/i18n';
import { buildURLData } from 'web-utility/source/URL';
import { formToJSON } from 'web-utility/source/DOM';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { BreadCrumb } from 'boot-cell/source/Navigator/BreadCrumb';
import { Form } from 'boot-cell/source/Form/Form';
import { FormField } from 'boot-cell/source/Form/FormField';
import { ToggleField } from 'boot-cell/source/Form/ToggleField';
import { Button } from 'boot-cell/source/Form/Button';

import { words } from '../../i18n';
import { activity, history, Team } from '../../model';

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

        if (this.tid) await activity.team.getOne(this.tid);
    }

    saveTeam = async (event: Event) => {
        event.preventDefault(), event.stopPropagation();

        const { activity: aid, tid } = this,
            form = event.target as HTMLFormElement;
        const { displayName, ...data } = formToJSON<Team>(form),
            operation = tid ? words.edit : words.create;

        await activity.team.updateOne({
            displayName: displayName + '',
            ...data,
            id: tid
        });
        self.alert(textJoin(operation, displayName, words.team, words.success));

        history.push(`team?${buildURLData({ activity: aid, tid })}`);
    };

    render() {
        const { displayName: hackathonDisplayName, name: hackathonName } =
            activity.current;
        const { displayName, description, autoApprove } =
            (activity.team && activity.team.current) || {};
        const loading = activity.loading || activity.team.loading;

        return (
            <SpinnerBox className="container" cover={loading}>
                <BreadCrumb
                    path={[
                        {
                            title: hackathonDisplayName,
                            href: 'activity?name=' + hackathonName
                        },
                        {
                            title:
                                displayName ||
                                textJoin(words.create, words.team)
                        }
                    ]}
                />
                <div className="d-lg-flex">
                    <div className="border bg-white flex-fill p-3">
                        <Form onSubmit={this.saveTeam}>
                            <FormField
                                label={textJoin(words.team, words.name)}
                                name="displayName"
                                labelColumn={2}
                                placeholder="团队名称"
                                value={displayName}
                                required
                            />
                            <FormField
                                label={textJoin(words.team, words.introduction)}
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
                                {words.auto_approve}
                            </ToggleField>
                            <small className="text-muted">
                                {words.auto_approve_tips}
                            </small>
                            <footer>
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="mt-3"
                                    disabled={loading}
                                >
                                    {words.submit}
                                </Button>
                            </footer>
                        </Form>
                    </div>
                </div>
            </SpinnerBox>
        );
    }
}
