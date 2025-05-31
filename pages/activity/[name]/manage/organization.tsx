import { Organizer } from '@kaiyuanshe/openhackathon-service';
import { Loading } from 'idea-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Column, RestTable } from 'mobx-restful-table';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Badge, Col, Image, ListGroup, Row } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import activityStore from '../../../../models/Activity';
import { OrganizerTypeName } from '../../../../models/Activity/Organization';
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

  @computed
  get columns(): Column<Organizer>[] {
    const i18n = this.observedContext;
    const { t } = i18n;

    return [
      { key: 'name', renderHead: t('name') },
      { key: 'description', renderHead: t('introduction') },
      {
        key: 'type',
        renderHead: t('type'),
        renderBody: ({ type }) => OrganizerTypeName(i18n)[type],
      },
      {
        key: 'logo',
        renderBody: ({ logo, name, description }) =>
          logo && (
            <Image
              style={{ width: '3rem' }}
              src={logo?.uri}
              alt={logo?.description || description}
              title={logo?.name || name}
            />
          ),
      },
    ];
  }

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
      { downloading, uploading } = this.store;
    const { t } = i18n,
      loading = downloading > 0 || uploading > 0;

    return (
      <Row>
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
