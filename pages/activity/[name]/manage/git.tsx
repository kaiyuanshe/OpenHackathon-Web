import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { CardList } from '../../../../components/Git/CardList';
import { GitModal } from '../../../../components/Git/Modal';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Translation';
import { withRoute } from '../../../api/core';

const { t } = i18n;

export const getServerSideProps = withRoute<{ name: string }>();

@observer
export default class ActivityManageGitPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
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
    const { resolvedUrl, params } = this.props.route;
    const { store, selectedIds, show } = this;

    return (
      <ActivityManageFrame
        path={resolvedUrl}
        name={params!.name}
        title={t('cloud_development_environment')}
      >
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
      </ActivityManageFrame>
    );
  }
}
