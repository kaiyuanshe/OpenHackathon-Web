import { observer } from 'mobx-react';

import { Staff, StaffModel } from '../../models/Staff';
import { XScrollList, XScrollListProps } from '../ScrollList';
import { HackathonAdminList } from './HackathonAdminList';

export interface StaffListProps extends XScrollListProps<Staff> {
  store: StaffModel;
}

@observer
export class StaffList extends XScrollList<StaffListProps> {
  store = this.props.store;

  constructor(props: StaffListProps) {
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
