import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  compose,
  JWTProps,
  jwtVerifier,
  RouteProps,
  router,
} from 'next-ssr-middleware';
import { createRef, FC, FormEvent, PureComponent } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { MessageList } from '../../../../components/Message/MessageList';
import { MessageModal } from '../../../../components/Message/MessageModal';
import { ServerSessionBox } from '../../../../components/User/ServerSessionBox';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Base/Translation';

const { t } = i18n;

type MessageListPageProps = RouteProps<{ name: string }> & JWTProps;

export const getServerSideProps = compose<
  { name: string },
  MessageListPageProps
>(router, jwtVerifier());

const MessageListPage: FC<MessageListPageProps> = observer(props => (
  <ServerSessionBox {...props}>
    <ActivityManageFrame
      {...props}
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('announcement_manage')}
    >
      <MessageListEditor {...props} />
    </ActivityManageFrame>
  </ServerSessionBox>
));

export default MessageListPage;

@observer
class MessageListEditor extends PureComponent<MessageListPageProps> {
  constructor(props: MessageListPageProps) {
    super(props);
    makeObservable(this);
  }

  store = activityStore.messageOf(this.props.route.params!.name);

  form = createRef<HTMLFormElement>();

  @observable
  selectedIds: string[] = [];

  @observable
  show = false;

  handleReset = () => this.form.current?.reset();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;

    if (!selectedIds[0])
      return alert(t('please_select_at_least_one_announcement'));

    if (!confirm(t('confirm_to_delete_announcement'))) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  render() {
    const { store, show } = this;
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

        <MessageList
          store={store}
          hideControls={false}
          onSelect={list => (this.selectedIds = list)}
          onEdit={() => (this.show = true)}
          onDelete={this.handleReset}
        />
        <MessageModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => (this.show = false) || store.refreshList()}
        />
      </Container>
    );
  }
}
