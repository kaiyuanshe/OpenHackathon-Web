import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
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
        title="团队管理"
      >
        <Container fluid>
          <header className="d-flex justify-content-between mb-3">
            <Form className="d-flex" onSubmit={this.onSearch}>
              <Form.Control type="search" name="search" />

              <Button type="submit" className="ms-3 text-nowrap">
                搜索
              </Button>
            </Form>
            <DropdownButton variant="success" title="导出">
              <Dropdown.Item href={exportURL}>所有团队</Dropdown.Item>
              <Dropdown.Item href={workExportURL}>所有作品</Dropdown.Item>
            </DropdownButton>
          </header>
          <TeamList store={this.store} />
        </Container>
      </ActivityManageFrame>
    );
  }
}
