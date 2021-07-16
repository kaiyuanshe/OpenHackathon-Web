import { createCell, Fragment } from 'web-cell';
import { Day } from 'web-utility/source/date';
import { textJoin } from 'web-utility/source/i18n';
import classNames from 'classnames';
import { CardProps, Card, CardFooter } from 'boot-cell/source/Content/Card';
import { FAIcon } from 'boot-cell/source/Reminder/FAIcon';
import { Button } from 'boot-cell/source/Form/Button';

import { words } from '../i18n';
import { Activity } from '../model';

export interface ActivityCardProps extends Omit<Activity, 'id'>, CardProps {
    manage?: boolean;
    onPublish?: (name: string) => any;
    onDelete?: (name: string) => any;
}

export function ActivityCard({
    className,
    name,
    displayName,
    eventStartedAt,
    location,
    tags,
    enrollmentEndedAt,
    status,
    enrollment,
    manage,
    onPublish,
    onDelete,
    ...rest
}: ActivityCardProps) {
    const event_start = new Date(eventStartedAt),
        event_end = new Date(enrollmentEndedAt);
    const days = Math.ceil((+event_end - Date.now()) / Day);

    const toolbar = !manage ? (
        days > 0 ? (
            <Button block color="primary" href={`activity?name=${name}`}>
                {words.register}
            </Button>
        ) : (
            <Button block color="secondary" disabled>
                {words.registration_closed}
            </Button>
        )
    ) : (
        <>
            <Button block color="info" href={'manage/activity?name=' + name}>
                {words.manage_this_hackathon}
            </Button>
            {status === 'online' ? (
                <Button block color="warning" className="mt-2">
                    {words.apply_to_offline}
                </Button>
            ) : (
                onPublish && (
                    <Button
                        block
                        color="success"
                        className="mt-2"
                        onClick={() => onPublish(name)}
                    >
                        {words.apply_to_online}
                    </Button>
                )
            )}
            {!manage || !onDelete ? null : (
                <Button block color="danger" onClick={() => onDelete(name)}>
                    {words.delete}
                </Button>
            )}
        </>
    );

    return (
        <Card
            {...rest}
            className={classNames(
                'mb-3',
                'border',
                'border-success',
                'rounded-lg',
                className
            )}
            title={<a href={'activity?name=' + name}>{displayName}</a>}
        >
            <small className="d-flex justify-content-between">
                <time dateTime={event_start.toJSON()}>
                    <FAIcon name="calendar-alt" color="success" />{' '}
                    {event_start.toLocaleString()}
                </time>
                <span>
                    <FAIcon name="map-marker-alt" color="success" />{' '}
                    {location?.split(' ')[0]}
                </span>
            </small>
            <hr />
            <ul className="list-inline text-success">
                {tags?.map(tag => (
                    <li className="list-inline-item">
                        <small>{tag}</small>
                    </li>
                ))}
            </ul>
            <CardFooter>
                <small className="d-flex justify-content-between mb-2">
                    <time dateTime={event_end.toJSON()}>
                        {days < 0
                            ? null
                            : textJoin(
                                  words.registration_deadline,
                                  days + '',
                                  words.days
                              )}
                    </time>
                    {/* <span>
                        <FAIcon name="heart" color="danger" /> {stat?.like}
                    </span> */}
                    <span>
                        {textJoin(
                            enrollment + '',
                            words.people,
                            words.registered
                        )}
                    </span>
                </small>

                {toolbar}
            </CardFooter>
        </Card>
    );
}
