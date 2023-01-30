import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
import { Badge, Button, Col, Form, ListGroup, Row } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { AdministratorModal } from '../../../../components/ActivityAdministratorModal';
import { StaffList } from '../../../../components/User/StaffList';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Translation';
import { withRoute, withTranslation } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

const { t } = i18n;

@observer
export default class AdministratorPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.staffOf(this.props.route.params!.name + '');

  selectedIds: string[] = [];

  @observable
  show = false;

  //处理删除管理员或裁判
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;

    if (!selectedIds[0]) return alert(t('please_select_at_least_one_user'));

    if (!confirm(t('confirm_to_delete_admin_or_referee'))) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  renderList() {
    const { allItems, typeCount } = this.store;

    return (
      <ListGroup>
        <ListGroup.Item className="d-flex justify-content-between">
          {t('all_user')}
          <Badge className="ms-2" bg="secondary">
            {allItems.length}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          {t('admin')}
          <Badge className="ms-2" bg="secondary">
            {typeCount.admin}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          {t('referee')}
          <Badge className="ms-2" bg="secondary">
            {typeCount.judge}
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
        title={t('admin')}
      >
        <Form onSubmit={this.handleSubmit}>
          <Row xs="1" sm="2">
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
              <StaffList
                store={store}
                onSelect={list => (this.selectedIds = list)}
              />
            </Col>
          </Row>
        </Form>

        <AdministratorModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => (this.show = false) || this.store.refreshList()}
        />
      </ActivityManageFrame>
    );
  }
}
