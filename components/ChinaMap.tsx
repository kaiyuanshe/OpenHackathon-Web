// eslint-disable-next-line simple-import-sort/imports
import { tileLayer } from 'leaflet';
import 'leaflet.chinatmsproviders';
import { OpenMap, OpenMapProps } from 'idea-react';
import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';

function ChinaTileLayer() {
  const map = useMap();

  useEffect(() => {
    // @ts-ignore
    tileLayer.chinaProvider('GaoDe.Normal.Map').addTo(map);
  }, [map]);

  return <></>;
}

const ChinaMap: FC<OpenMapProps> = props => (
  <OpenMap {...props} renderTileLayer={() => <ChinaTileLayer />} />
);
export default ChinaMap;
