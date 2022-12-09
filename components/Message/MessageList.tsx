import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Button, Form, Table } from 'react-bootstrap';

import {
  Message,
  MessageModel,
  MessageType,
  MessageTypeName,
} from '../../models/Message';
import styles from '../../styles/participant.module.less';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface MessageListProps extends ScrollListProps<Message> {
  store: MessageModel;
  hideControls: boolean;
  onEdit?: (id: string) => any;
  onDelete?: (id: string) => any;
}

export const MessageListLayout = ({
  value = [],
  selectedIds = [],
  hideControls,
  onSelect,
  onEdit,
  onDelete,
}: Omit<MessageListProps, 'store'>) => (
  <Table hover responsive="lg" className={styles.table}>
    <thead>
      <tr>
        <th hidden={hideControls}>
          <Form.Check
            inline
            type="checkbox"
            name="announcementId"
            checked={
              selectedIds?.length > 0 && selectedIds?.length === value?.length
            }
            ref={(input: HTMLInputElement | null) =>
              input &&
              (input.indeterminate =
                !!selectedIds?.length && selectedIds.length < value.length)
            }
            onChange={() =>
              onSelect?.(
                selectedIds.length === value.length
                  ? []
                  : value.map(({ id }) => id + ''),
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
      {value.map(({ id, title, content }) => (
        <tr key={id}>
          <td hidden={hideControls}>
            <Form.Check
              inline
              type="checkbox"
              name="announcementId"
              checked={selectedIds?.includes(id + '')}
              onClick={
                onSelect &&
                (({ currentTarget: { checked } }) => {
                  if (checked) return onSelect([...selectedIds, id + '']);

                  const index = selectedIds.indexOf(id + '');

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
          <td>{MessageTypeName[MessageType.Hackathon]}</td>
          <td hidden={hideControls}>
            <Button
              className="me-2"
              variant="primary"
              size="sm"
              onClick={() => onEdit?.(id!)}
            >
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

@observer
export class MessageList extends ScrollList<MessageListProps> {
  store = this.props.store;

  constructor(props: MessageListProps) {
    super(props);

    this.boot();
  }

  onEdit = (id: string) => {
    this.props.onEdit?.(id);
    this.store.getOne(id);
  };

  onDelete = (id: string) => {
    if (!confirm(t('sure_delete_this_message'))) return;

    this.props.onDelete?.(id);
    this.store.deleteOne(id);
  };

  renderList() {
    return (
      <MessageListLayout
        {...this.props}
        value={this.store.allItems}
        selectedIds={this.selectedIds}
        onSelect={this.onSelect}
        onEdit={this.onEdit}
        onDelete={this.onDelete}
      />
    );
  }
}
