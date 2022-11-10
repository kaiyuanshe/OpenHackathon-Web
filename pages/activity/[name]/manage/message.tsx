import { Button, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { createRef, FormEvent, PureComponent } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { InferGetServerSidePropsType } from 'next';

import { MessageList } from '../../../../components/Message/MessageList';
import { MessageModal } from '../../../../components/Message/ActivityMessageModal';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import activityStore from '../../../../models/Activity';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

@observer
export default class MessageListPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  messageList = createRef<MessageList>();
  store = activityStore.messageOf(this.props.route.params!.name);
  form = createRef<HTMLFormElement>();

  @observable
  show = false;

  @observable
  hide = false;

  selectedIds: string[] = [];

  handleReset = () => this.form.current?.reset();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;

    if (!selectedIds[0]) return alert('请至少选择一条公告!');

    if (!confirm('确认删除所选公告？')) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  render() {
    const { resolvedUrl, params } = this.props.route,
      { store, show } = this;
    const activity = params!.name;

    return (
      <ActivityManageFrame name={activity} path={resolvedUrl} title="公告管理">
        <Form onSubmit={this.handleSubmit}>
          <Row xs={1} sm={2}>
            <Col sm="auto" md="auto">
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
            </Col>
          </Row>
        </Form>
        <MessageList
          store={store}
          hide={this.hide}
          onSelect={list => (this.selectedIds = list)}
          onEdit={() => (this.show = true)}
          onDelete={this.handleReset}
        />

        <MessageModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => (this.show = false) || this.store.refreshList()}
        />
      </ActivityManageFrame>
    );
  }
}
