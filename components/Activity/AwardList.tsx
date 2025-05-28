import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { FC, PureComponent, useContext } from 'react';
import { Button, Image, Table } from 'react-bootstrap';

import { Award } from '../../models/Activity/Award';
import { i18n, I18nContext } from '../../models/Base/Translation';
import styles from '../../styles/Table.module.less';
import { XScrollListProps } from '../layout/ScrollList';

export interface AwardListLayoutProps extends XScrollListProps<Award> {
  onEdit?: (id: number) => any;
  onDelete?: (id: number) => any;
}

export const AwardTargetName = ({ t }: typeof i18n) => ({
  individual: t('personal'),
  team: t('team'),
});

const AwardTableHead = ({ t }: typeof i18n) => [
  t('quantity'),
  t('type'),
  t('photo'),
  t('name'),
  t('description'),
  t('operation'),
];

export const AwardListLayout: FC<AwardListLayoutProps> = observer(
  ({ defaultData = [], onEdit, onDelete }) => {
    const i18n = useContext(I18nContext);
    const { t } = i18n;

    return (
      <Table hover responsive="lg" className={styles.table}>
        <thead>
          <tr>
            {AwardTableHead(i18n).map((data, idx) => (
              <th key={idx}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {defaultData.map(({ quantity, target, pictures, name, description, id }) => (
            <tr key={id}>
              <td>{quantity}</td>
              <td>{AwardTargetName(i18n)[target]}</td>
              <td>
                {pictures! && <Image src={pictures?.[0].uri} alt={pictures?.[0].description} />}
              </td>
              <td>
                <Button variant="link" onClick={() => onEdit?.(id!)}>
                  {name}
                </Button>
              </td>
              <td>{description}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => onDelete?.(id!)}>
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  {t('delete')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  },
);

export type AwardListProps = Pick<ScrollListProps<Award>, 'store'> & AwardListLayoutProps;

export class AwardList extends PureComponent<AwardListProps> {
  onEdit = (id: number) => {
    this.props.onEdit?.(id);
    this.props.store.getOne(id);
  };

  onDelete = (id: number) => {
    if (!confirm(i18n.t('sure_delete_this_work'))) return;

    this.props.onDelete?.(id);
    this.props.store.deleteOne(id);
  };

  render() {
    return (
      <ScrollList
        translator={i18n}
        store={this.props.store}
        renderList={allItems => (
          <AwardListLayout defaultData={allItems} onEdit={this.onEdit} onDelete={this.onDelete} />
        )}
      />
    );
  }
}
