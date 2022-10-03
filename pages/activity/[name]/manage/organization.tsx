import { PureComponent } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { observer } from 'mobx-react';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';

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
  render() {
    const { path, name } = this.props;

    return (
      <ActivityManageFrame path={path} name={name}>
        <header>
          <h2>主办方信息</h2>
        </header>
      </ActivityManageFrame>
    );
  }
}
