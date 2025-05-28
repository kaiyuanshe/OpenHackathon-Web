import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { Component, Context, FC, FormEvent, useContext } from 'react';
import { Badge, Button, Col, Form, ListGroup, Row } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { OrganizationModal } from '../../../../components/Organization/ActivityOrganizationModal';
import { OrganizationTableLayout } from '../../../../components/Organization/OrganizationList';
import activityStore from '../../../../models/Activity';
import { i18n, I18nContext } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

type OrganizationPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const OrganizationPage: FC<OrganizationPageProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <ActivityManageFrame
      {...props}
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('organizer_manage')}
    >
      <OrganizationEditor {...props} />
    </ActivityManageFrame>
  );
});
export default OrganizationPage;

@observer
class OrganizationEditor extends ObservedComponent<OrganizationPageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.organizationOf(this.props.route.params!.name);

  @observable
  accessor selectedIds: number[] = [];

  @observable
  accessor show = false;

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { t } = this.observedContext,
      { selectedIds } = this;

    if (!selectedIds[0]) return alert(t('please_select_at_least_one_partner'));

    if (!confirm(t('confirm_to_delete_partner'))) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  renderList() {
    const { t } = this.observedContext,
      { allItems, typeCount } = this.store;

    return (
      <ListGroup>
        <ListGroup.Item className="d-flex justify-content-between">
          {t('all')}
          <Badge className="ms-2" bg="secondary">
            {allItems.length}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          {t('organizer')}
          <Badge className="ms-2" bg="secondary">
            {typeCount.host || 0}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          {t('partners')}
          <Badge className="ms-2" bg="secondary">
            {allItems.length - (typeCount.host || 0)}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    );
  }

  render() {
    const i18n = this.observedContext,
      { store, show } = this;
    const { t } = i18n,
      loading = store.uploading > 0;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row xs={1} sm={2}>
          <Col sm="auto" md="auto">
            {this.renderList()}

            <Col className="d-flex flex-column">
              <Button
                variant="success"
                className="my-3"
                disabled={loading}
                onClick={() => (this.show = true)}
              >
                <FontAwesomeIcon className="me-2" icon={faPlus} />
                {t('add')}
              </Button>
              <Button variant="danger" type="submit" disabled={loading}>
                <FontAwesomeIcon className="me-2" icon={faTrash} />
                {t('delete')}
              </Button>
            </Col>
          </Col>
          <Col className="flex-fill">
            <ScrollList
              translator={i18n}
              store={store}
              renderList={allItems => (
                <OrganizationTableLayout
                  defaultData={allItems}
                  selectedIds={this.selectedIds}
                  onSelect={list => (this.selectedIds = list)}
                />
              )}
            />
          </Col>
        </Row>

        <OrganizationModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => {
            this.show = false;
            store.refreshList();
          }}
        />
      </Form>
    );
  }
}
