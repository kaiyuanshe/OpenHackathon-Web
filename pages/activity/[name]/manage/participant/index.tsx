import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../../components/Activity/ActivityManageFrame';
import { EnrollmentList } from '../../../../../components/EnrollmentList';
import activityStore from '../../../../../models/Activity';
import { Enrollment } from '../../../../../models/Enrollment';
import { withRoute } from '../../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

@observer
export default class ParticipantPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.enrollmentOf(this.props.route.params!.name);

  @observable
  extensions?: Enrollment['extensions'];

  render() {
    const { resolvedUrl, params } = this.props.route,
      { extensions } = this;
    const activity = params!.name;

    return (
      <ActivityManageFrame name={activity} path={resolvedUrl} title="报名用户">
        <header className="d-flex justify-content-end mb-3 px-3">
          <Button variant="success" href={resolvedUrl + '/statistic'}>
            查看统计
          </Button>
        </header>

        <EnrollmentList
          activity={activity}
          onPopUp={extensions => (this.extensions = extensions)}
        />
        <Modal show={!!extensions} onHide={() => (this.extensions = undefined)}>
          <Modal.Header closeButton>
            <Modal.Title>参赛者问卷</Modal.Title>
          </Modal.Header>
          <Modal.Body as="ul">
            {extensions?.map(({ name, value }) => (
              <li key={name}>
                <strong>{name}</strong>
                <div>{value}</div>
              </li>
            ))}
          </Modal.Body>
        </Modal>
      </ActivityManageFrame>
    );
  }
}
