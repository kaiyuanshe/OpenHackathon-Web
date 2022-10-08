import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Modal } from 'react-bootstrap';
import { GetServerSidePropsContext } from 'next';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { EnrollmentList } from '../../../../components/EnrollmentList';
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
  @observable
  extensions?: Enrollment['extensions'];

  render() {
    const { activity, path } = this.props,
      { extensions } = this;

    return (
      <ActivityManageFrame name={activity} path={path}>
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
