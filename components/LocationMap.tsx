import { PropsWithChildren, PureComponent } from 'react';
import { Loading } from 'idea-react';
import { buildURLData } from 'web-utility';

import { AMapGeoList } from '../models/Map';
import { request } from '../pages/api/core';

const Name = process.env.NEXT_PUBLIC_SITE_NAME,
  Key = process.env.NEXT_PUBLIC_AMAP_HTTP_KEY!;

export type LocationMapProps = PropsWithChildren<{
  title?: string;
  address: string;
}>;

interface State {
  loading?: boolean;
  latitude?: string;
  longitude?: string;
}

export class LocationMap extends PureComponent<LocationMapProps, State> {
  state: Readonly<State> = {
    loading: true,
  };

  /**
   * @see https://lbs.amap.com/api/webservice/guide/api/georegeo
   */
  async componentDidMount() {
    const { address } = this.props;
    const {
      status,
      info,
      geocodes: [geoCode],
    } = await request<AMapGeoList>(
      `https://restapi.amap.com/v3/geocode/geo?${new URLSearchParams({
        key: Key,
        address,
      })}`,
    );
    if (status !== '1') alert(info);
    else if (geoCode) {
      const [longitude, latitude] = geoCode.location.split(',');

      this.setState({ latitude, longitude });
    }
    this.setState({ loading: false });
  }

  /**
   * @see https://lbs.amap.com/api/uri-api/guide/mobile-web/point
   */
  render() {
    const { title, children } = this.props,
      { loading, latitude, longitude } = this.state;

    return loading ? (
      <Loading />
    ) : latitude && longitude ? (
      <iframe
        className="w-100"
        style={{ minHeight: '70vh' }}
        src={`//uri.amap.com/marker?${buildURLData({
          src: Name,
          position: [longitude, latitude],
          name: title,
          callnative: 1,
        })}`}
      />
    ) : (
      children
    );
  }
}
