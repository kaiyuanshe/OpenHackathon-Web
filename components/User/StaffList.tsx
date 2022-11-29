import { observer } from 'mobx-react';

import { Staff, StaffModel } from '../../models/Staff';
import { ScrollList, ScrollListProps } from '../ScrollList';
import { HackathonAdminList } from './HackathonAdminList';

export interface StaffListProps extends ScrollListProps<Staff> {
  store: StaffModel;
}

@observer
export class StaffList extends ScrollList<StaffListProps> {
  store = this.props.store;

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
