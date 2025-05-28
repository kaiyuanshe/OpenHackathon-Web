import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, FormEvent, useContext } from 'react';
import { Button, Container, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { TeamListLayout } from '../../../../components/Team/TeamList';
import activityStore from '../../../../models/Activity';
import { i18n, I18nContext } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

type TeamManagePageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const TeamManagePage: FC<TeamManagePageProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <ActivityManageFrame
      {...props}
      path={props.route.resolvedUrl}
      name={props.route.params!.name}
      title={t('team_manage')}
    >
      <TeamManageEditor {...props} />
    </ActivityManageFrame>
  );
});
export default TeamManagePage;

@observer
class TeamManageEditor extends ObservedComponent<TeamManagePageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.teamOf(this.props.route.params!.name);

  onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { keywords } = formToJSON<{ keywords: string }>(event.currentTarget);

    this.store.clear();

    return this.store.getList({ keywords });
  };

  render() {
    const i18n = this.observedContext,
      { exportURL, workExportURL } = this.store;
    const { t } = i18n;

    return (
      <Container fluid>
        <header className="d-flex justify-content-between mb-3">
          <Form className="d-flex" onSubmit={this.onSearch}>
            <Form.Control type="search" name="keywords" />

            <Button type="submit" className="ms-3 text-nowrap">
              {t('search')}
            </Button>
          </Form>
          <DropdownButton variant="success" title={t('export')}>
            <Dropdown.Item href={exportURL}>{t('all_teams')}</Dropdown.Item>
            <Dropdown.Item href={workExportURL}>{t('all_works')}</Dropdown.Item>
          </DropdownButton>
        </header>

        <ScrollList
          translator={i18n}
          store={this.store}
          renderList={allItems => <TeamListLayout defaultData={allItems} />}
        />
      </Container>
    );
  }
}
