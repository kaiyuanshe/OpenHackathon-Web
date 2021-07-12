import { createCell } from 'web-cell';

import { ActivityCardProps, ActivityCard } from './ActivityCard';
import { Activity } from '../model';

export interface ActivityGalleryProps
    extends Pick<ActivityCardProps, 'manage' | 'onPublish' | 'onDelete'> {
    list: Activity[];
}

export function ActivityGallery({ list, ...props }: ActivityGalleryProps) {
    return (
        <ol className="row">
            {list.map(({ id, ...item }) => (
                <li className="col-12 col-sm-6 col-md-4 mb-4 d-flex" key={id}>
                    <ActivityCard
                        style={{ flex: '1' }}
                        {...{ ...item, ...props }}
                    />
                </li>
            ))}
        </ol>
    );
}
