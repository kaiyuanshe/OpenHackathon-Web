import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Button, Image, Table } from 'react-bootstrap';

import { Award, AwardModel } from '../models/Award';
import styles from '../styles/Table.module.less';
import { ScrollList, ScrollListProps } from './ScrollList';

export interface AwardListProps extends ScrollListProps<Award> {
  store: AwardModel;
  onEdit?: (id: string) => any;
  onDelete?: (id: string) => any;
}

export const AwardTargetName = {
  individual: t('personal'),
  team: t('team'),
};
const awardTableHead = [
  t('weights'),
  t('type'),
  t('photo'),
  t('name'),
  t('description'),
  t('operate'),
];

@observer
export class AwardList extends ScrollList<AwardListProps> {
  store = this.props.store;

  extraProps: Partial<AwardListProps> = {
    onEdit: id => {
      this.props.onEdit?.(id);
      this.store.getOne(id);
    },
    onDelete: id => {
      if (!confirm(t('sure_delete_this_work'))) return;

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
