import { observer } from 'mobx-react';
import { Table } from 'react-bootstrap';

import { ScrollListProps, ScrollList } from './ScrollList';
import styles from '../styles/participant.module.less';
import activityStore from '../models/Activity';
import { Message } from '../models/Message';

export interface MessageListProps extends ScrollListProps<Message> {
  activity: string;
}
@observer
export class MessageList extends ScrollList<MessageListProps> {
  store = activityStore.messageOf(this.props.activity);

  static Layout = ({ value = [] }: MessageListProps) => (
    <Table className={styles['container-table']}>
      <thead>
        <tr>
          <th>#</th>
          <th>公告名称</th>
          <th>链接</th>
          <th>类型</th>
        </tr>
      </thead>
      <tbody>
        {value.map(({ id, hackathonName, title, content }, index) => (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>{hackathonName}</td>
            <td>{title}</td>
            <td>{content}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
