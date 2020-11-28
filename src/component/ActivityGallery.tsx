import { createCell } from 'web-cell';

import { ActivityCard } from './ActivityCard';
import { Activity } from '../model';

export function ActivityGallery({ list }: { list: Activity[] }) {
    return (
        <div className="row">
            {list.map(item => (
                <div className="col-12 col-sm-6 col-md-4 mb-4 d-flex">
                    <ActivityCard style={{ flex: '1' }} {...item} />
                </div>
            ))}
        </div>
    );
}
