import { t } from 'i18next';
import { Button } from 'react-bootstrap';

import { Activity } from '../../models/Activity';

export interface ActivityControlProps
  extends Pick<Activity, 'name' | 'status'> {
  onPublish?: (name: string) => any;
  onDelete?: (name: string) => any;
}

export function ActivityControl({
  name,
  status,
  onPublish,
  onDelete,
}: ActivityControlProps) {
  return (
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
          {status === 'planning' ? t('apply_publish') : t('publish')}
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
  );
}
