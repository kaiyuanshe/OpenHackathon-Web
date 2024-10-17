import { Hackathon } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Button } from 'react-bootstrap';

import { t } from '../../models/Base/Translation';
import platformAdmin from '../../models/User/PlatformAdmin';

export interface ActivityControlProps
  extends Pick<Hackathon, 'name' | 'status'> {
  onPublish?: (name: string) => any;
  onDelete?: (name: string) => any;
}

export const ActivityControl: FC<ActivityControlProps> = observer(
  ({ name, status, onPublish, onDelete }) => (
    <>
      <Button
        className="w-100 mt-2"
        variant="info"
        href={`/activity/${name}/manage/edit`}
      >
        {t('manage_this_hackathon')}
      </Button>
      {status !== 'online' ? (
        <Button
          className="w-100 mt-2"
          variant="success"
          onClick={() => onPublish?.(name)}
        >
          {platformAdmin.isPlatformAdmin ? t('publish') : t('apply_publish')}
        </Button>
      ) : (
        <Button
          className="w-100 mt-2"
          variant="warning"
          onClick={() => onDelete?.(name)}
        >
          {t('offline')}
        </Button>
      )}
    </>
  ),
);
