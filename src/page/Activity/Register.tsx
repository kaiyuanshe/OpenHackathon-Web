import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { textJoin } from 'web-utility/source/i18n';
import { formToJSON } from 'web-utility/source/DOM';
import { FormField } from 'boot-cell/source/Form/FormField';
import { ToggleField } from 'boot-cell/source/Form/ToggleField';
import { Button } from 'boot-cell/source/Form/Button';

import { words } from '../../i18n';
import { Question, activity, history } from '../../model';
import { questions } from './questions';

@component({
    tagName: 'register-page',
    renderTarget: 'children'
})
export class RegisterPage extends mixin() {
    @attribute
    @watch
    name = '';

    connectedCallback() {
        this.classList.add('d-block', 'container');

        super.connectedCallback();

        if (this.name !== activity.current.name) activity.getOne(this.name);
    }

    handleSubmit = async (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        const data = formToJSON(event.target as HTMLFormElement),
            {
                registration,
                current: { displayName }
            } = activity;

        await registration.createOne({
            extensions: Object.entries(data).map(([name, value]) => ({
                name,
                value: value + ''
            }))
        });
        self.alert(
            textJoin(
                words.hackathons,
                displayName,
                words.registration_needs_review
            )
        );
        history.replace(`activity?name=${this.name}`);
    };

    renderField = (
        { options, multiple, title, ...props }: Question,
        index: number
    ) => {
        const label = `${index + 1}. ${title}`;

        return options ? (
            <FormField label={label}>
                <div className="row">
                    {options.map(value => (
                        <ToggleField
                            className="col-12 col-sm-4 col-md-3"
                            type={multiple ? 'checkbox' : 'radio'}
                            name={title}
                            key={value}
                        >
                            {value}
                        </ToggleField>
                    ))}
                </div>
            </FormField>
        ) : (
            <FormField label={label} name={title} {...props} />
        );
    };

    render() {
        return (
            <form className="container py-3" onSubmit={this.handleSubmit}>
                <legend className="text-center">参赛者问卷</legend>

                <p className="text-muted">
                    建议您先完善或更新
                    <a
                        target="_blank"
                        href="https://ophapiv2-demo.authing.cn/u"
                    >
                        个人资料
                    </a>
                </p>
                {questions.map(this.renderField)}

                <footer className="text-center">
                    <Button type="submit" color="success">
                        报名参加
                    </Button>
                </footer>
            </form>
        );
    }
}
