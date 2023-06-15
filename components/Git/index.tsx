import { observer } from 'mobx-react';

import { GitTemplate, GitTemplateModal } from '../../models/TemplateRepo';
import { XScrollList, XScrollListProps } from '../layout/ScrollList';
import { CardList } from './CardList';

export interface GitListProps extends XScrollListProps<GitTemplate> {
  store: GitTemplateModal;
}

@observer
export class GitList extends XScrollList<GitListProps> {
  store = this.props.store;

  constructor(props: GitListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return (
      <CardList
        defaultData={this.store.allItems}
        selectedIds={this.selectedIds}
        onSelect={this.onSelect}
      />
    );
  }
}
