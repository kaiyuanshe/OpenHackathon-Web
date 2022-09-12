import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Loading, OpenMap, OpenMapModel } from 'idea-react';

export interface LocationMapProps {
  title?: string;
  address: string;
}

export const openMapStore = new OpenMapModel();

@observer
export class LocationMap extends PureComponent<LocationMapProps> {
  @observable
  loading = false;

  async componentDidMount() {
    const { address } = this.props;

    if (!address) return;

    this.loading = true;

    await openMapStore.search(address);

    this.loading = false;
  }

  render() {
    const { title, children } = this.props,
      { loading } = this,
      [location] = openMapStore.locations;

    const position: [number, number] = location && [
      +location.lat,
      +location.lon,
    ];

    return loading ? (
      <Loading />
    ) : position ? (
      <OpenMap
        center={position}
        zoom={10}
        markers={[{ position, tooltip: title }]}
      />
    ) : (
      children
    );
  }
}
