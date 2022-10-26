import { t } from 'i18next';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { TeamList } from '../../../../components/Team/TeamList';
import activityStore from '../../../../models/Activity';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

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
        <header className="d-flex justify-content-between mb-3">
          <Form className="d-flex" onSubmit={this.onSearch}>
            <Form.Control type="search" name="search" />

            <Button type="submit" className="ms-3 text-nowrap">
              {t('search')}
            </Button>
          </Form>
          <DropdownButton variant="success" title={t('export')}>
            <Dropdown.Item href={exportURL}>{t('all_teams')}</Dropdown.Item>
            <Dropdown.Item href={workExportURL}>{t('all_works')}</Dropdown.Item>
          </DropdownButton>
        </header>
        <TeamList store={this.store} />
      </ActivityManageFrame>
    );
  }
}
