import { observer } from 'mobx-react';

import { PlatformAdmin, PlatformAdminModel } from '../../models/PlatformAdmin';
import { ScrollList, ScrollListProps } from '../ScrollList';
import { HackathonAdminList } from '../User/HackathonAdminList';

export interface PlatformAdminListProps extends ScrollListProps<PlatformAdmin> {
  store: PlatformAdminModel;
}

@observer
export class PlatformAdminList extends ScrollList<PlatformAdminListProps> {
  store = this.props.store;

  constructor(props: PlatformAdminListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return (
      <HackathonAdminList
        value={this.store.allItems}
        selectedIds={this.selectedIds}
        onSelect={this.onSelect}
      />
    );
  }
}
