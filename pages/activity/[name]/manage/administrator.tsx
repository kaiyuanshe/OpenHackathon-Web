import { Staff, StaffType } from '@kaiyuanshe/openhackathon-service';
import { Loading } from 'idea-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Column, RestTable } from 'mobx-restful-table';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Badge, Col, ListGroup, Row } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { adminColumns } from '../../../../components/User/HackathonAdminList';
import activityStore from '../../../../models/Activity';
import { i18n, I18nContext } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

type AdministratorPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const AdministratorPage: FC<AdministratorPageProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <ActivityManageFrame
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('admin')}
    >
      <AdministratorEditor {...props} />
    </ActivityManageFrame>
  );
});
export default AdministratorPage;

@observer
class AdministratorEditor extends ObservedComponent<AdministratorPageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.staffOf(this.props.route.params!.name + '');

  @computed
  get columns() {
    const i18n = this.observedContext;
    const { t } = i18n;

    return [
      {
        key: 'type',
        renderHead: t('type'),
        type: 'radio',
        options: [
          { value: 'admin', label: t('admin') },
          { value: 'judge', label: t('referee') },
        ],
      },
      ...adminColumns(i18n),
    ] as Column<Staff>[];
  }

  renderList() {
    const { t } = this.observedContext,
      { allItems, typeCount } = this.store;

    return (
      <ListGroup>
        <ListGroup.Item
          className="d-flex justify-content-between"
          action
          onClick={() => this.store.getList({}, 1)}
        >
          {t('all_user')}
          <Badge className="ms-2" bg="secondary">
            {allItems.length}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item
          className="d-flex justify-content-between"
          action
          onClick={() => this.store.getList({ type: 'admin' as StaffType.Admin }, 1)}
        >
          {t('admin')}
          <Badge className="ms-2" bg="secondary">
            {typeCount.admin}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item
          className="d-flex justify-content-between"
          action
          onClick={() => this.store.getList({ type: 'judge' as StaffType.Judge }, 1)}
        >
          {t('referee')}
          <Badge className="ms-2" bg="secondary">
            {typeCount.judge}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    );
  }

  render() {
    const i18n = this.observedContext,
      { downloading, uploading } = this.store;

    const loading = downloading > 0 || uploading > 0;

    return (
      <Row xs="1" sm="2">
        <Col sm="auto" md="auto">
          {this.renderList()}
        </Col>
        <Col className="flex-fill">
          <RestTable
            translator={i18n}
            store={this.store}
            columns={this.columns}
            editable
            deletable
          />
          {loading && <Loading />}
        </Col>
      </Row>
    );
  }
}
