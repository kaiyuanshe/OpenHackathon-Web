import { createCell } from 'web-cell';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Field } from 'boot-cell/source/Form/Field';

export function TimeRange({ parent_name }: { parent_name: string }) {
    return (
        <InputGroup>
            时间范围
            <Field
                type="datetime-local"
                name={parent_name + '_start_time'}
                required
            />
            <Field
                type="datetime-local"
                name={parent_name + '_end_time'}
                required
            />
        </InputGroup>
    );
}
