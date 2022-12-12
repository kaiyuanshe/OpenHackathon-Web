import { observer } from 'mobx-react';

import { PlatformAdmin, PlatformAdminModel } from '../../models/PlatformAdmin';
import { XScrollList, XScrollListProps } from '../ScrollList';
import { HackathonAdminList } from '../User/HackathonAdminList';

export interface PlatformAdminListProps
  extends XScrollListProps<PlatformAdmin> {
  store: PlatformAdminModel;
}

@observer
export class PlatformAdminList extends XScrollList<PlatformAdminListProps> {
  store = this.props.store;

  constructor(props: PlatformAdminListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return (
      <HackathonAdminList
        defaultData={this.store.allItems}
        selectedIds={this.selectedIds}
        onSelect={this.onSelect}
      />
    );
  }
}
