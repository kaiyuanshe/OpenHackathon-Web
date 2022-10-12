
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Table from 'react-bootstrap/Table';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { PureComponent } from 'react';
import { EnrollmentList } from '../../../../components/EnrollmentList';
import { Modal } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Message, MessageModel } from '../../../../models/Message';
import { MessageList } from '../../../../components/MessageList';

interface ActivityMessageProps {
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
          props: {} as ActivityMessageProps,
        }
      : {
          props: { activity: name, path: req.url },
        };
  }
  
  @observer
  export default class MessageListPage extends PureComponent<ActivityMessageProps> {

    @observable
    extensions?: Message;

    render() {
      const { activity, path } = this.props;
  
      return (
        <ActivityManageFrame name={activity} path={path}>
          <MessageList
            activity={activity}/>
    
        </ActivityManageFrame>
      );
    }
  }
