import { createCell } from 'web-cell';

import { ActivityCardProps, ActivityCard } from './ActivityCard';
import { Activity } from '../model';

export interface ActivityGalleryProps {
    list: Activity[];
    manage?: ActivityCardProps['manage'];
}

export function ActivityGallery({ list, manage }: ActivityGalleryProps) {
    return (
        <div className="row">
            {list.map(item => (
                <div className="col-12 col-sm-6 col-md-4 mb-4 d-flex">
                    <ActivityCard
                        style={{ flex: '1' }}
                        {...{ ...item, manage }}
                    />
                </div>
            ))}
        </div>
    );
}
