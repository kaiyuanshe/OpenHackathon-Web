import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { GetServerSidePropsContext } from 'next';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { EnrollmentList } from '../../../../components/EnrollmentList';
import activityStore from '../../../../models/Activity';
import { Enrollment } from '../../../../models/Enrollment';

interface ActivityParticipantProps {
  activity: string;
  path: string;
}

export function getServerSideProps({
  params: { name } = {},
  req,
}: GetServerSidePropsContext<{ name?: string }>) {
  return !name
    ? {
        notFound: true,
        props: {} as ActivityParticipantProps,
      }
    : {
        props: { activity: name, path: req.url },
      };
}

@observer
export default class ParticipantPage extends PureComponent<ActivityParticipantProps> {
  store = activityStore.enrollmentOf(this.props.activity);

  @observable
  extensions?: Enrollment['extensions'];

  render() {
    const { activity, path } = this.props,
      { extensions } = this,
      { exportURL } = this.store;

    return (
      <ActivityManageFrame name={activity} path={path}>
        <header className="d-flex justify-content-end mb-3">
          <Button variant="success" href={exportURL}>
            导出所有报名信息
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
