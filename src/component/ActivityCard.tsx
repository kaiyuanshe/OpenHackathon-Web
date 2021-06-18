import { createCell, Fragment } from 'web-cell';
import { Day } from 'web-utility/source/date';
import classNames from 'classnames';
import { CardProps, Card, CardFooter } from 'boot-cell/source/Content/Card';
import { FAIcon } from 'boot-cell/source/Reminder/FAIcon';
import { Button } from 'boot-cell/source/Form/Button';

import { Activity, session, activity } from '../model';

export interface ActivityCardProps extends Omit<Activity, 'id'>, CardProps {
    manage?: boolean;
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
    stat,
    creatorId,
    manage,
    ...rest
}: ActivityCardProps) {
    const event_start = new Date(eventStartedAt),
        event_end = new Date(enrollmentEndedAt);
    const days = Math.ceil((+event_end - Date.now()) / Day);

    const toolbar =
        !manage || creatorId !== session.user?.id ? (
            days > 0 ? (
                <Button
                    block
                    color="primary"
                    onClick={() => activity.addRegistration(name)}
                >
                    报名参加
                </Button>
            ) : (
                <Button block color="secondary" disabled>
                    报名已截止
                </Button>
            )
        ) : (
            <>
                <Button
                    block
                    color="warning"
                    href={'manage/activity?name=' + name}
                >
                    编辑活动
                </Button>
                {status === 'online' ? (
                    <Button block color="danger" className="mt-2">
                        申请下线
                    </Button>
                ) : (
                    <Button block color="success" className="mt-2">
                        申请上线
                    </Button>
                )}
            </>
        );

    return (
        <Card
            {...rest}
            key={rest.id}
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
                    {location.split(' ')[0]}
                </span>
            </small>
            <hr />
            <ul className="list-inline text-success">
                {tags.map(tag => (
                    <li className="list-inline-item">
                        <small>{tag}</small>
                    </li>
                ))}
            </ul>
            <CardFooter>
                <small className="d-flex justify-content-between mb-2">
                    <time dateTime={event_end.toJSON()}>
                        报名截止 {days < 0 ? '--' : days} 天
                    </time>
                    <span>
                        <FAIcon name="heart" color="danger" /> {stat?.like}
                    </span>
                    <span>{stat?.register}人报名</span>
                </small>

                {toolbar}
            </CardFooter>
        </Card>
    );
}
