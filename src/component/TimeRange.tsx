import { createCell } from 'web-cell';
import { HTMLFieldProps } from 'web-utility/source/DOM-type';
import { formatDate } from 'web-utility/source/date';
import { InputGroup, InputGroupProps } from 'boot-cell/source/Form/InputGroup';
import { Field } from 'boot-cell/source/Form/Field';

import { i18nTextOf } from '../i18n';

export interface TimeRangeProps extends HTMLFieldProps, InputGroupProps {}

export function TimeRange({
    name,
    value,
    required,
    disabled,
    autofocus,
    onFocus,
    onBlur,
    defaultSlot,
    ...rest
}: TimeRangeProps) {
    const [start, end] = value?.split(',') || [],
        input_props = {
            required,
            disabled,
            autofocus,
            onFocus,
            onBlur
        };
    const startTime = isNaN(+start) ? start : +start,
        endTime = isNaN(+end) ? end : +end;

    return (
        <InputGroup {...rest}>
            {i18nTextOf('time_range')}
            <Field
                type="datetime-local"
                name={name + 'StartedAt'}
                value={start && formatDate(startTime, 'YYYY-MM-DDTHH:mm')}
                {...input_props}
            />
            <Field
                type="datetime-local"
                name={name + 'EndedAt'}
                value={end && formatDate(endTime, 'YYYY-MM-DDTHH:mm')}
                {...input_props}
            />
        </InputGroup>
    );
}
