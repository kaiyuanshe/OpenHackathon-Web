import { createCell } from 'web-cell';
import { Day } from 'web-utility/source/date';
import classNames from 'classnames';
import { CardProps, Card } from 'boot-cell/source/Content/Card';
import { FAIcon } from 'boot-cell/source/Reminder/FAIcon';
import { Button } from 'boot-cell/source/Form/Button';

import { Activity } from '../model';

export type ActivityCardProps = Omit<Activity, 'id'> & CardProps;

export function ActivityCard({
    className,
    name,
    display_name,
    event_start_time,
    location,
    tags,
    registration_end_time,
    stat,
    ...rest
}: ActivityCardProps) {
    const event_start = new Date(event_start_time),
        days = Math.ceil((registration_end_time - Date.now()) / Day);

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
            title={<a href={'activity?name=' + name}>{display_name}</a>}
            footer={
                <div>
                    <small className="d-flex justify-content-between mb-2">
                        <time
                            datetime={new Date(registration_end_time).toJSON()}
                        >
                            报名截止 {days < 0 ? '--' : days} 天
                        </time>
                        <span>
                            <FAIcon name="heart" color="danger" /> {stat?.like}
                        </span>
                        <span>{stat?.register}人报名</span>
                    </small>
                    {days > 0 ? (
                        <Button
                            className="w-75 m-auto d-block justify-content-center"
                            color="primary"
                        >
                            报名参加
                        </Button>
                    ) : (
                        <Button
                            className="w-75 m-auto d-block justify-content-center"
                            color="secondary"
                            disabled
                        >
                            报名已截止
                        </Button>
                    )}
                </div>
            }
        >
            <small className="d-flex justify-content-between">
                <time datetime={event_start.toJSON()}>
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
        </Card>
    );
}
