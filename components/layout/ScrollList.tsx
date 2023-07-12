import { DataObject } from 'mobx-restful';
import { ScrollListProps } from 'mobx-restful-table';

export interface XScrollListProps<T extends DataObject = DataObject>
  extends Pick<ScrollListProps<T>, 'defaultData'> {
  selectedIds?: string[];
  onSelect?: (selectedIds: string[]) => any;
}
