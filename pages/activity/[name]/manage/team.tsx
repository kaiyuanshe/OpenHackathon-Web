import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { TeamList } from '../../../../components/Team/TeamList';
import activityStore from '../../../../models/Activity';

export const getServerSideProps = async ({
  req,
  params,
}: GetServerSidePropsContext<{
  name: string;
}>) =>
  params?.name
    ? { props: { path: req.url, name: params.name } }
    : { notFound: true, props: {} as Record<'path' | 'name', string> };

@observer
export default class TeamManagePage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.teamOf(this.props.name);

  render() {
    const { path, name } = this.props,
      { exportURL, workExportURL } = this.store;

    return (
      <ActivityManageFrame path={path} name={name}>
        <header className="d-flex justify-content-end mb-3">
          <DropdownButton variant="success" title="导出">
            <Dropdown.Item href={exportURL}>所有团队</Dropdown.Item>
            <Dropdown.Item href={workExportURL}>所有作品</Dropdown.Item>
          </DropdownButton>
        </header>
        <TeamList activity={name} />
      </ActivityManageFrame>
    );
  }
}
