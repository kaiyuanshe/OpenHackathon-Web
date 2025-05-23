import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Announcement } from '@kaiyuanshe/openhackathon-service';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { Component, FC } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

import {
  AnnouncementType,
  AnnouncementTypeName,
} from '../../models/Activity/Message';
import { i18n, t } from '../../models/Base/Translation';
import styles from '../../styles/participant.module.less';
import { XScrollListProps } from '../layout/ScrollList';

export interface AnnouncementListLayoutProps
  extends XScrollListProps<Announcement> {
  hideControls?: boolean;
  onEdit?: (id: number) => any;
  onDelete?: (id: number) => any;
}

export const AnnouncementListLayout: FC<AnnouncementListLayoutProps> = observer(
  ({
    defaultData = [],
    selectedIds = [],
    hideControls,
    onSelect,
    onEdit,
    onDelete,
  }) => (
    <Table hover responsive="lg" className={styles.table}>
      <thead>
        <tr>
          <th hidden={hideControls}>
            <Form.Check
              ref={(input: HTMLInputElement | null) => {
                if (input)
                  input.indeterminate =
                    !!selectedIds?.length &&
                    selectedIds.length < defaultData.length;
              }}
              inline
              type="checkbox"
              name="announcementId"
              checked={
                selectedIds?.length > 0 &&
                selectedIds?.length === defaultData?.length
              }
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

                    onSelect([
                      ...selectedIds.slice(0, index),
                      ...selectedIds.slice(index + 1),
                    ]);
                  })
                }
              />
            </td>
            <td>{title}</td>
            <td>{content}</td>
            <td>{AnnouncementTypeName()[AnnouncementType.Hackathon]}</td>
            <td hidden={hideControls}>
              <Button
                className="me-2"
                variant="primary"
                size="sm"
                onClick={() => onEdit?.(id!)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete?.(id!)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
);

export type AnnouncementListProps = Pick<
  ScrollListProps<Announcement>,
  'store'
> &
  AnnouncementListLayoutProps;

@observer
export class AnnouncementList extends Component<AnnouncementListProps> {
  @observable
  accessor selectedIds: number[] = [];

  onSelect = (list: number[]) =>
    (this.selectedIds = list) && this.props.onSelect?.(list);

  onEdit = (id: number) => {
    this.props.onEdit?.(id);
    this.props.store.getOne(id);
  };

  onDelete = (id: number) => {
    if (!confirm(t('sure_delete_this_message'))) return;

    this.props.onDelete?.(id);
    this.props.store.deleteOne(id);
  };

  render() {
    const { props } = this;

    return (
      <ScrollList
        translator={i18n}
        store={this.props.store}
        renderList={allItems => (
          <AnnouncementListLayout
            {...{ ...props, ...this }}
            defaultData={allItems}
          />
        )}
      />
    );
  }
}
