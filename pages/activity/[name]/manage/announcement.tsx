import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { AnnouncementList } from '../../../../components/Message/MessageList';
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

  render() {
    const { downloading, uploading } = this.store;
    const loading = downloading > 0 || uploading > 0;

    return (
      <Container fluid>
        <AnnouncementList store={this.store} editable deletable />

        {loading && <Loading />}
      </Container>
    );
  }
}
