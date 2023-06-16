import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { GitList } from '../../../../components/Git';
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
  @observable
  show = false;

  store = activityStore.templateOf(this.props.route.params!.name + '');

  selectedIds: string[] = [];

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
    const { store } = this;
    let { show, selectedIds } = this;

    return (
      <ActivityManageFrame
        path={resolvedUrl}
        name={params!.name}
        title={t('cloud_development_environment')}
      >
        <Container fluid>
          <header className="d-flex justify-content-end mb-3">
            <Form onSubmit={this.handleSubmit}>
              <Button variant="danger" type="submit" className="me-2">
                <FontAwesomeIcon className="me-2" icon={faTrash} />
                {t('delete')}
              </Button>
              <Button variant="success" onClick={() => (this.show = true)}>
                {t('add_template_repository')}
              </Button>
            </Form>
          </header>
          <GitList
            store={store}
            selectedIds={selectedIds}
            onSelect={list => (selectedIds = list)}
          />
          <GitModal
            store={store}
            show={show}
            onHide={() => (show = false)}
            onSave={() => (show = false) || store.refreshList()}
          />
        </Container>
      </ActivityManageFrame>
    );
  }
}
