
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { FormEvent, PureComponent } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Message } from '../../../../models/Message';
import { MessageList } from '../../../../components/MessageList';
import { GetServerSidePropsContext } from 'next';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import activityStore from '../../../../models/Activity';


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
  store = activityStore.staffOf(this.props.activity);

  @observable
  extensions?: Message;

  selectedIds: string[] = [];

  @observable
  show = false;

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { selectedIds } = this;

    if (!selectedIds[0]) return alert('请至少选择一条公告');

    if (!confirm('确认删除所选公告？')) return;

    for (const id of selectedIds) await this.store.deleteOne(id);
  };

  render() {
    const { activity, path } = this.props;

    return (
      <ActivityManageFrame name={activity} path={path}>

        <Button
          variant="success"
          className="my-3"
          onClick={() => (this.show = true)}
        >
          <FontAwesomeIcon className="me-2" icon={faPlus} />
          发布新公告
        </Button>
        <Button variant="danger" type="submit" id="delete">
          <FontAwesomeIcon className="me-2" icon={faTrash} />
          删除
        </Button>
        <MessageList
          activity={activity} />

      </ActivityManageFrame >
    );
  }
}
