import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Announcement } from '@kaiyuanshe/openhackathon-service';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { FC, useContext } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

import { AnnouncementType, AnnouncementTypeName } from '../../models/Activity/Message';
import { i18n, I18nContext } from '../../models/Base/Translation';
import styles from '../../styles/participant.module.less';
import { XScrollListProps } from '../layout/ScrollList';

export interface AnnouncementListLayoutProps extends XScrollListProps<Announcement> {
  hideControls?: boolean;
  onEdit?: (id: number) => any;
  onDelete?: (id: number) => any;
}

export const AnnouncementListLayout: FC<AnnouncementListLayoutProps> = observer(
  ({ defaultData = [], selectedIds = [], hideControls, onSelect, onEdit, onDelete }) => {
    const i18n = useContext(I18nContext);
    const { t } = i18n;

    return (
      <Table hover responsive="lg" className={styles.table}>
        <thead>
          <tr>
            <th hidden={hideControls}>
              <Form.Check
                ref={(input: HTMLInputElement | null) => {
                  if (input)
                    input.indeterminate =
                      !!selectedIds?.length && selectedIds.length < defaultData.length;
                }}
                inline
                type="checkbox"
                name="announcementId"
                checked={selectedIds?.length > 0 && selectedIds?.length === defaultData?.length}
                onChange={() =>
                  onSelect?.(
                    selectedIds.length === defaultData.length
                      ? []
                      : defaultData.map(({ id }) => id),
                  )
                }
              />
            </th>
            <th>{t('title')}</th>
            <th>{t('content')}</th>
            <th>{t('type')}</th>
            <th hidden={hideControls}>{t('operation')}</th>
          </tr>
        </thead>
        <tbody>
          {defaultData.map(({ id, title, content }) => (
            <tr key={id}>
              <td hidden={hideControls}>
                <Form.Check
                  inline
                  type="checkbox"
                  name="announcementId"
                  checked={selectedIds?.includes(id)}
                  onClick={
                    onSelect &&
                    (({ currentTarget: { checked } }) => {
                      if (checked) return onSelect([...selectedIds, id]);

                      const index = selectedIds.indexOf(id);

                      onSelect([...selectedIds.slice(0, index), ...selectedIds.slice(index + 1)]);
                    })
                  }
                />
              </td>
              <td>{title}</td>
              <td>{content}</td>
              <td>{AnnouncementTypeName(i18n)[AnnouncementType.Hackathon]}</td>
              <td hidden={hideControls}>
                <Button className="me-2" variant="primary" size="sm" onClick={() => onEdit?.(id!)}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete?.(id!)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  },
);

export type AnnouncementListProps = Pick<ScrollListProps<Announcement>, 'store'> &
  AnnouncementListLayoutProps;

@observer
export class AnnouncementList extends ObservedComponent<AnnouncementListProps, typeof i18n> {
  static contextType = I18nContext;

  @observable
  accessor selectedIds: number[] = [];

  onSelect = (list: number[]) => (this.selectedIds = list) && this.props.onSelect?.(list);

  onEdit = (id: number) => {
    this.props.onEdit?.(id);
    this.props.store.getOne(id);
  };

  onDelete = (id: number) => {
    const { t } = this.observedContext;

    if (!confirm(t('sure_delete_this_message'))) return;

    this.props.onDelete?.(id);
    this.props.store.deleteOne(id);
  };

  render() {
    const i18n = this.observedContext,
      { props } = this;

    return (
      <ScrollList
        translator={i18n}
        store={this.props.store}
        renderList={allItems => (
          <AnnouncementListLayout {...{ ...props, ...this }} defaultData={allItems} />
        )}
      />
    );
  }
}
