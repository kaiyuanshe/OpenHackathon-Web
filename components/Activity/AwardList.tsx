import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react';
import { Button, Image, Table } from 'react-bootstrap';

import { Award, AwardModel } from '../../models/Award';
import { i18n } from '../../models/Translation';
import styles from '../../styles/Table.module.less';
import { XScrollList, XScrollListProps } from '../layout/ScrollList';

const { t } = i18n;

export interface AwardListProps extends XScrollListProps<Award> {
  store: AwardModel;
  onEdit?: (id: string) => any;
  onDelete?: (id: string) => any;
}

export const AwardTargetName = {
  individual: t('personal'),
  team: t('team'),
};

const awardTableHead = [
  t('quantity'),
  t('type'),
  t('photo'),
  t('name'),
  t('description'),
  t('operation'),
];

export const AwardListLayout = ({
  defaultData = [],
  onEdit,
  onDelete,
}: Omit<AwardListProps, 'store'>) => (
  <Table hover responsive="lg" className={styles.table}>
    <thead>
      <tr>
        {awardTableHead.map((data, idx) => (
          <th key={idx}>{data}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {defaultData.map(
        ({ quantity, target, pictures, name, description, id }) => (
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
        ),
      )}
    </tbody>
  </Table>
);

@observer
export class AwardList extends XScrollList<AwardListProps> {
  store = this.props.store;

  constructor(props: AwardListProps) {
    super(props);

    this.boot();
  }

  onEdit = (id: string) => {
    this.props.onEdit?.(id);
    this.store.getOne(id);
  };

  onDelete = (id: string) => {
    const { t } = i18n;

    if (!confirm(t('sure_delete_this_work'))) return;

    this.props.onDelete?.(id);
    this.store.deleteOne(id);
  };

  renderList() {
    return (
      <AwardListLayout
        defaultData={this.store.allItems}
        onEdit={this.onEdit}
        onDelete={this.onDelete}
      />
    );
  }
}
