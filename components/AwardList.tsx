import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Button, Image, Table } from 'react-bootstrap';

import activityStore from '../models/Activity';
import { Award } from '../models/Award';
import styles from '../styles/Table.module.less';
import { ScrollList, ScrollListProps } from './ScrollList';

export interface AwardListProps extends ScrollListProps<Award> {
  activity: string;
  onEdit?: (id: string) => any;
  onDelete?: (id: string) => any;
}

export const AwardTargetName = {
  individual: t('personal'),
  team: t('team'),
};
const awardTableHead = ['权重', '类型', '照片', '名称', '描述', '操作'];

@observer
export class AwardList extends ScrollList<AwardListProps> {
  store = activityStore.awardOf(this.props.activity);

  extraProps: Partial<AwardListProps> = {
    onEdit: id => {
      this.props.onEdit?.(id);
      this.store.getOne(id);
    },
    onDelete: id => {
      if (!confirm('确定删除该奖项？')) return;

      this.props.onDelete?.(id);
      this.store.deleteOne(id);
    },
  };

  static Layout = ({ value = [], onEdit, onDelete }: AwardListProps) => (
    <Table hover responsive="lg" className={styles.table}>
      <thead>
        <tr>
          {awardTableHead.map((data, idx) => (
            <th key={idx}>{data}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {value.map(({ quantity, target, pictures, name, description, id }) => (
          <tr key={id}>
            <td>{quantity}</td>
            <td>{AwardTargetName[target]}</td>
            <td>
              {pictures! && (
                <Image
                  src={pictures?.[0].uri}
                  alt={pictures?.[0].description}
                />
              )}
            </td>
            <td>
              <Button variant="link" onClick={() => onEdit?.(id!)}>
                {name}
              </Button>
            </td>
            <td>{description}</td>
            <td>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete?.(id!)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                {t('delete')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
