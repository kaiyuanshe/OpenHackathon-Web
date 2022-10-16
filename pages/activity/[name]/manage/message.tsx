import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormEvent, PureComponent } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { InferGetServerSidePropsType } from 'next';

import { MessageList } from '../../../../components/MessageList';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { Message } from '../../../../models/Message';
import activityStore from '../../../../models/Activity';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

@observer
export default class MessageListPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.messageOf(this.props.route.params!.name);

  @observable
  extensions?: Message;

  selectedIds: string[] = [];

  @observable
  show = false;

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;

    if (!selectedIds[0]) return alert('请至少选择一条公告');

    if (!confirm('确认删除所选公告？')) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  render() {
    const basePath = this.store.baseURI;
    const activity = this.props.route.params!.name;

    return (
      <ActivityManageFrame name={activity} path={basePath} title="公告管理">
        <Button
          variant="success"
          className="my-3"
          onClick={() => (this.show = true)}
        >
          <FontAwesomeIcon className="me-2" icon={faPlus} />
          发布新公告
        </Button>
        <Button variant="danger" type="submit" id="delete">
          <FontAwesomeIcon className="me-2" icon={faTrash} />
          删除
        </Button>
        <MessageList activity={activity} />
      </ActivityManageFrame>
    );
  }
}
