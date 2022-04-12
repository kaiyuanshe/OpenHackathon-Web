import { Button } from 'react-bootstrap';

import { Activity } from '../models/Activity';

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
        href={`/activity/${name}/admin`}
      >
        管理
      </Button>
      {status !== 'online' ? (
        <Button
          className="w-100 mt-2"
          variant="success"
          onClick={() => onPublish?.(name)}
        >
          {status === 'planning' && '申请'}上线
        </Button>
      ) : (
        <Button className="w-100 mt-2" variant="warning">
          下线
        </Button>
      )}
      <Button
        className="w-100 mt-2"
        variant="danger"
        onClick={() => onDelete?.(name)}
      >
        删除
      </Button>
    </>
  );
}
