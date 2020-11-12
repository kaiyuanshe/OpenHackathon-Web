import { createCell } from 'web-cell';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Field } from 'boot-cell/source/Form/Field';

export function TimeRange() {
    return (
        <InputGroup>
            时间范围
            <Field type="datetime-local" name="start_time" required />
            <Field type="datetime-local" name="end_time" required />
        </InputGroup>
    );
}
