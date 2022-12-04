import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import { MainBreadcrumb } from '../../../components/MainBreadcrumb';
import PageHead from '../../../components/PageHead';
import activityStore, { Activity } from '../../../models/Activity';

interface OrganizationPageProps {
  activity: Activity;
}

export async function getServerSideProps({
  params: { name = '' } = {},
}: GetServerSidePropsContext<{ name?: string }>) {
  try {
    const activity = await activityStore.getOne(name);

    return {
      props: { activity },
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
      props: {} as OrganizationPageProps,
    };
  }
}

export default class OrganizationPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.organizationOf(this.props.activity.name);

  get currentRoute() {
    const {
      activity: { displayName: hackathonDisplayName },
    } = this.props;

    return [
      {
        title: hackathonDisplayName,
      },
    ];
  }

  render() {
    return (
      <Container as="main" className="mt-4">
        <PageHead />

        <MainBreadcrumb currentRoute={this.currentRoute} />
      </Container>
    );
  }
}
