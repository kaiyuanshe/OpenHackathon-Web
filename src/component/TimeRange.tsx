import { createCell } from 'web-cell';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Field } from 'boot-cell/source/Form/Field';

export function TimeRange({
    parent_name,
    start_time,
    end_time
}: {
    parent_name: string;
    start_time?: string;
    end_time?: string;
}) {
    return (
        <InputGroup>
            时间范围
            <Field
                type="datetime-local"
                name={parent_name + '_start_time'}
                value={start_time}
                required
            />
            <Field
                type="datetime-local"
                name={parent_name + '_end_time'}
                value={end_time}
                required
            />
        </InputGroup>
    );
}
