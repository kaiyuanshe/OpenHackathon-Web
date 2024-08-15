import { Base } from '@kaiyuanshe/openhackathon-service';
import { ScrollListProps } from 'mobx-restful-table';

export interface XScrollListProps<T extends Base = Base>
  extends Pick<ScrollListProps<T>, 'defaultData'> {
  selectedIds?: number[];
  onSelect?: (selectedIds: number[]) => any;
}
