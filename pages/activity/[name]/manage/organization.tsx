import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FormEvent, PureComponent } from 'react';
import { Badge, Button, Col, Form, ListGroup, Row } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { OrganizationModal } from '../../../../components/Organization/ActivityOrganizationModal';
import { OrganizationTableLayout } from '../../../../components/Organization/OrganizationList';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Base/Translation';

type OrganizationPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<
  { name: string },
  OrganizationPageProps
>(router);

const { t } = i18n;

@observer
export default class OrganizationPage extends PureComponent<OrganizationPageProps> {
  constructor(props: OrganizationPageProps) {
    super(props);
    makeObservable(this);
  }

  store = activityStore.organizationOf(this.props.route.params!.name);

  @observable
  selectedIds: string[] = [];

  @observable
  show = false;

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;

    if (!selectedIds[0]) return alert(t('please_select_at_least_one_partner'));

    if (!confirm(t('confirm_to_delete_partner'))) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  renderList() {
    const { allItems, typeCount } = this.store;

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
    const { resolvedUrl, params } = this.props.route,
      { store, show } = this;
    const loading = store.uploading > 0;

    return (
      <ActivityManageFrame
        name={params!.name}
        path={resolvedUrl}
        title={t('organizer_manage')}
      >
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
        </Form>

        <OrganizationModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => (this.show = false) || store.refreshList()}
        />
      </ActivityManageFrame>
    );
  }
}
