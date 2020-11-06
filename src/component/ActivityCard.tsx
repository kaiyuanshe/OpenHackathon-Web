import { createCell } from 'web-cell';
import { Card } from 'boot-cell/source/Content/Card';
import { FAIcon } from 'boot-cell/source/Reminder/FAIcon';
import { Button } from 'boot-cell/source/Form/Button';

import { Activity } from '../model';

export function ActivityCard({
    name,
    display_name,
    banners,
    event_start_time,
    location,
    tags,
    registration_end_time,
    stat
}: Activity) {
    const event_start = new Date(event_start_time),
        days = +(
            (registration_end_time - Date.now()) /
            (1000 * 60 * 60 * 24)
        ).toFixed(0);

    return (
        <Card
            className="mb-3 d-flex border border-success rounded-lg"
            style={{ width: '18rem' }}
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
                            block
                            justify-content-center
                            className="w-75 m-auto"
                            color="primary"
                        >
                            报名参加
                        </Button>
                    ) : (
                        <Button
                            block
                            justify-content-center
                            className="w-75 m-auto"
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
                    <li class="list-inline-item">
                        <small>{tag}</small>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
