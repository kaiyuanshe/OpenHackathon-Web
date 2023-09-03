import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FormEvent, PureComponent } from 'react';
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Form,
} from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { TeamListLayout } from '../../../../components/Team/TeamList';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Base/Translation';

export const getServerSideProps = compose<
  { name: string },
  RouteProps<{ name: string }>
>(router);

const { t } = i18n;

@observer
export default class TeamManagePage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.teamOf(this.props.route.params!.name);

  onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { search } = formToJSON<{ search: string }>(event.currentTarget);

    this.store.clear();
    return this.store.getList({ search });
  };

  render() {
    const { resolvedUrl, params } = this.props.route,
      { exportURL, workExportURL } = this.store;

    return (
      <ActivityManageFrame
        path={resolvedUrl}
        name={params!.name}
        title={t('team_manage')}
      >
        <Container fluid>
          <header className="d-flex justify-content-between mb-3">
            <Form className="d-flex" onSubmit={this.onSearch}>
              <Form.Control type="search" name="search" />

              <Button type="submit" className="ms-3 text-nowrap">
                {t('search')}
              </Button>
            </Form>
            <DropdownButton variant="success" title={t('export')}>
              <Dropdown.Item href={exportURL}>{t('all_teams')}</Dropdown.Item>
              <Dropdown.Item href={workExportURL}>
                {t('all_works')}
              </Dropdown.Item>
            </DropdownButton>
          </header>
          <ScrollList
            translator={i18n}
            store={this.store}
            renderList={allItems => <TeamListLayout defaultData={allItems} />}
          />
        </Container>
      </ActivityManageFrame>
    );
  }
}
