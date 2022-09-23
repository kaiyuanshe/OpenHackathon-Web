import { observer } from 'mobx-react';
import { Ratio, Image, Accordion } from 'react-bootstrap';

import { ScrollListProps, ScrollList } from '../ScrollList';
import { TeamWork, TeamWorkType } from '../../models/Team';
import activityStore from '../../models/Activity';

export interface TeamWorkListProps extends ScrollListProps<TeamWork> {
  activity: string;
  team: string;
}

@observer
export class TeamWorkList extends ScrollList<TeamWorkListProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);

  static Layout = ({ value = [] }: TeamWorkListProps) => (
    <Accordion>
      {value.map(({ updatedAt, id, title, description, type, url }) => (
        <Accordion.Item eventKey={id!} key={id}>
          <Accordion.Header>
            {title} - {updatedAt ? updatedAt.slice(0, 10) + ' 更新' : ''}
          </Accordion.Header>
          <Accordion.Body>
            <p>{description}</p>
            {type === TeamWorkType.IMAGE ? (
              <Image src={url} className="mw-100" alt={title} />
            ) : type === TeamWorkType.VIDEO ? (
              <Ratio aspectRatio="16x9">
                <video controls width="250" src={url} />
              </Ratio>
            ) : (
              <a href={url} title={title}>
                {title}
              </a>
            )}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
