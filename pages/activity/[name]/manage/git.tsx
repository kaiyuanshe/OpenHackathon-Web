import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, FormEvent, useContext } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { CardList } from '../../../../components/Git/CardList';
import { GitModal } from '../../../../components/Git/Modal';
import activityStore from '../../../../models/Activity';
import { i18n, I18nContext } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

type ActivityManageGitPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const ActivityManageGitPage: FC<ActivityManageGitPageProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <ActivityManageFrame
      {...props}
      path={props.route.resolvedUrl}
      name={props.route.params!.name}
      title={t('cloud_development_environment')}
    >
      <ActivityManageGitEditor {...props} />
    </ActivityManageFrame>
  );
});
export default ActivityManageGitPage;

@observer
class ActivityManageGitEditor extends ObservedComponent<ActivityManageGitPageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.templateOf(this.props.route.params!.name + '');

  @observable
  accessor selectedIds: number[] = [];

  @observable
  accessor show = false;

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { t } = this.observedContext,
      { selectedIds } = this;

    if (!selectedIds[0]) return alert(t('choose_at_least_one_repo'));

    if (!confirm(t('confirm_delete_repo'))) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  render() {
    const i18n = this.observedContext,
      { store, selectedIds, show } = this;
    const { t } = i18n;

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
          onSave={() => {
            this.show = false;
            store.refreshList();
          }}
        />
      </Container>
    );
  }
}
