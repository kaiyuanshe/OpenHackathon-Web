import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { Component, Context, createRef, FC, FormEvent, useContext } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { AnnouncementList } from '../../../../components/Message/MessageList';
import { AnnouncementModal } from '../../../../components/Message/MessageModal';
import activityStore from '../../../../models/Activity';
import { i18n, I18nContext } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

type MessageListPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const MessageListPage: FC<MessageListPageProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <ActivityManageFrame
      {...props}
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('announcement_manage')}
    >
      <MessageListEditor {...props} />
    </ActivityManageFrame>
  );
});
export default MessageListPage;

@observer
class MessageListEditor extends ObservedComponent<MessageListPageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.announcementOf(this.props.route.params!.name);

  form = createRef<HTMLFormElement>();

  @observable
  accessor selectedIds: number[] = [];

  @observable
  accessor show = false;

  handleReset = () => this.form.current?.reset();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { t } = this.observedContext,
      { selectedIds } = this;

    if (!selectedIds[0]) return alert(t('please_select_at_least_one_announcement'));

    if (!confirm(t('confirm_to_delete_announcement'))) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  render() {
    const { t } = this.observedContext,
      { store, show } = this;
    const loading = store.uploading > 0;

    return (
      <Container fluid>
        <Form
          className="d-flex justify-content-between align-items-center"
          onSubmit={this.handleSubmit}
        >
          <Button
            variant="success"
            className="my-3"
            disabled={loading}
            onClick={() => (this.show = true)}
          >
            <FontAwesomeIcon className="me-2" icon={faPlus} />
            {t('publish_announcement')}
          </Button>
          <Button variant="danger" type="submit" disabled={loading}>
            <FontAwesomeIcon className="me-2" icon={faTrash} />
            {t('delete')}
          </Button>
        </Form>

        <AnnouncementList
          store={store}
          hideControls={false}
          onSelect={list => (this.selectedIds = list)}
          onEdit={() => (this.show = true)}
          onDelete={this.handleReset}
        />
        <AnnouncementModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => {
            this.show = false;
            store.refreshList();
          }}
        />
      </Container>
    );
  }
}
