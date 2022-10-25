import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react';
import { Button, Form, Table } from 'react-bootstrap';

import { Message, MessageModel } from '../../models/Message';
import styles from '../../styles/participant.module.less';
import { ScrollList,ScrollListProps } from '../ScrollList';

export interface MessageListProps extends ScrollListProps<Message> {
  store: MessageModel;
  onEdit?: (id: string) => any;
  onDelete?: (id: string) => any;
}

@observer
export class MessageList extends ScrollList<MessageListProps> {
  store = this.props.store;

  extraProps: Partial<MessageListProps> = {
    onEdit: id => {
      this.props.onEdit?.(id);
      this.store.getOne(id);
    },
    onDelete: id => {
      if (!confirm('确定删除该公告？')) return;

      this.props.onDelete?.(id);
      this.store.deleteOne(id);
    },
  };

  static Layout = ({
    value = [],
    selectedIds = [],
    onSelect,
    onEdit,
    onDelete,
  }: MessageListProps) => (
    <Table hover responsive="lg" className={styles.table}>
      <thead>
        <tr>
          <th>
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
          <th>公告名称</th>
          <th>链接</th>
          <th>类型</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {value.map(({ id, hackathonName, title, content }) => (
          <tr key={id}>
            <td>
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
            <td>{hackathonName}</td>
            <td>{title}</td>
            <td>{content}</td>
            <td>
              <Button variant="primary" size="sm" onClick={() => onEdit?.(id!)}>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete?.(id!)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
