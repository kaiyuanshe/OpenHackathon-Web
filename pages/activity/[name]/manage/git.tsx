import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import {
  compose,
  JWTProps,
  jwtVerifier,
  RouteProps,
  router,
} from 'next-ssr-middleware';
import { FC, FormEvent, PureComponent } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { CardList } from '../../../../components/Git/CardList';
import { GitModal } from '../../../../components/Git/Modal';
import { ServerSessionBox } from '../../../../components/User/ServerSessionBox';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Base/Translation';

const { t } = i18n;

type ActivityManageGitPageProps = RouteProps<{ name: string }> & JWTProps;

export const getServerSideProps = compose<
  { name: string },
  ActivityManageGitPageProps
>(router, jwtVerifier());

const ActivityManageGitPage: FC<ActivityManageGitPageProps> = observer(
  props => (
    <ServerSessionBox {...props}>
      <ActivityManageFrame
        {...props}
        path={props.route.resolvedUrl}
        name={props.route.params!.name}
        title={t('cloud_development_environment')}
      >
        <ActivityManageGitEditor {...props} />
      </ActivityManageFrame>
    </ServerSessionBox>
  ),
);
export default ActivityManageGitPage;

@observer
class ActivityManageGitEditor extends PureComponent<ActivityManageGitPageProps> {
  constructor(props: ActivityManageGitPageProps) {
    super(props);
    makeObservable(this);
  }

  store = activityStore.templateOf(this.props.route.params!.name + '');

  @observable
  selectedIds: string[] = [];

  @observable
  show = false;

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;
    if (!selectedIds[0]) return alert(t('choose_at_least_one_repo'));

    if (!confirm(t('confirm_delete_repo'))) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  render() {
    const { store, selectedIds, show } = this;

    return (
      <Container fluid>
        <header className="d-flex justify-content-end mb-3">
          <Form onSubmit={this.handleSubmit}>
            <Button variant="danger" className="me-2" type="submit">
              <FontAwesomeIcon className="me-2" icon={faTrash} />
              {t('delete')}
            </Button>
            <Button variant="success" onClick={() => (this.show = true)}>
              {t('add_template_repository')}
            </Button>
          </Form>
        </header>
        <ScrollList
          translator={i18n}
          store={store}
          renderList={allItems => (
            <CardList
              defaultData={allItems}
              selectedIds={selectedIds}
              onSelect={list => (this.selectedIds = list)}
            />
          )}
        />
        <GitModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => (this.show = false) || store.refreshList()}
        />
      </Container>
    );
  }
}
