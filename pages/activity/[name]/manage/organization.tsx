import { FormEvent, PureComponent } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { observer } from 'mobx-react';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import PageHead from '../../../../components/PageHead';
import { Badge, Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { OrganizationList } from '../../../../components/Organization/OrganizationList';
import activityStore from '../../../../models/Activity';
import { observable } from 'mobx';
import { OrganizationModal } from '../../../../components/Organization/ActivityOrganizationModal';

export const getServerSideProps = async ({
  req,
  params,
}: GetServerSidePropsContext<{
  name?: string;
}>) =>
  params?.name
    ? { props: { path: req.url, name: params.name } }
    : { notFound: true, props: {} as Record<'path' | 'name', string> };

@observer
export default class OrganizationPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.organizationOf(this.props.name);

  selectedIds: string[] = [];

  @observable
  show = false;

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;

    if (!selectedIds[0]) return alert('请至少选择一位主办方/合作伙伴!');

    if (!confirm('确认删除所选主办方/合作伙伴？')) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  renderList() {
    const { allItems, typeCount } = this.store;

    return (
      <ListGroup>
        <ListGroup.Item className="d-flex justify-content-between">
          全部
          <Badge className="ms-2" bg="secondary">
            {allItems.length}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          主办方
          <Badge className="ms-2" bg="secondary">
            {typeCount.host || 0}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          合作伙伴
          <Badge className="ms-2" bg="secondary">
            {allItems.length - (typeCount.host || 0)}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    );
  }

  render() {
    const { path, name } = this.props,
      { store, show } = this;

    return (
      <ActivityManageFrame path={path} name={name}>
        <PageHead title={`${name} 活动管理 主办方`} />

        <Form onSubmit={this.handleSubmit}>
          <Row xs="1" sm="2">
            <Col sm="auto" md="auto">
              {this.renderList()}

              <Col className="d-flex flex-column">
                <Button
                  variant="success"
                  className="my-3"
                  onClick={() => (this.show = true)}
                >
                  <FontAwesomeIcon className="me-2" icon={faPlus} />
                  增加
                </Button>
                <Button variant="danger" type="submit" id="delete">
                  <FontAwesomeIcon className="me-2" icon={faTrash} />
                  删除
                </Button>
              </Col>
            </Col>
            <Col className="flex-fill">
              <div>
                <OrganizationList
                  store={store}
                  onSelect={list => (this.selectedIds = list)}
                />
              </div>
            </Col>
          </Row>
        </Form>

        <OrganizationModal
          store={store}
          show={show}
          onHide={() => (this.show = false)}
          onSave={() => (this.show = false) || this.store.refreshList()}
        />
      </ActivityManageFrame>
    );
  }
}
