import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormEvent, PureComponent } from 'react';
import { Badge, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import { GetServerSidePropsContext } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import PageHead from '../../../../components/PageHead';
import { StaffList } from '../../../../components/User/StaffList';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { AdministratorModal } from '../../../../components/ActivityAdministratorModal';
import activityStore from '../../../../models/Activity';

interface AdministratorPageProps {
  activity: string;
  path: string;
}

export const getServerSideProps = ({
  params: { name } = {},
  req,
}: GetServerSidePropsContext<{ name?: string }>) =>
  !name
    ? {
        notFound: true,
        props: {} as AdministratorPageProps,
      }
    : {
        props: { activity: name, path: req.url },
      };

@observer
class AdministratorPage extends PureComponent<AdministratorPageProps> {
  store = activityStore.staffOf(this.props.activity);

  selectedIds: string[] = [];

  @observable
  show = false;

  //处理删除管理员或裁判
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;

    if (!selectedIds[0]) return alert('请至少选择一位用户');

    if (!confirm('确认删除所选管理员/裁判？')) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  renderList() {
    const { allItems, typeCount } = this.store;

    return (
      <ListGroup>
        <ListGroup.Item className="d-flex justify-content-between">
          全部用户
          <Badge className="ms-2" bg="secondary">
            {allItems.length}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          管理员
          <Badge className="ms-2" bg="secondary">
            {typeCount.admin}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          裁判
          <Badge className="ms-2" bg="secondary">
            {typeCount.judge}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    );
  }

  render() {
    const { activity, path } = this.props,
      { store, show } = this;

    return (
      <ActivityManageFrame name={activity} path={path}>
        <PageHead title={`${activity} 活动管理 管理员`} />

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

export default AdministratorPage;
