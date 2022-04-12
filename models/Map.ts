export interface Area {
  country: string;
  province: string;
  city: string;
  district: string;
}

export interface POIMeta {
  type: string;
  name: string;
}

export interface GeoCode extends Area {
  location: `${string},${string}`;
  formatted_address: string;
  citycode: string;
  adcode: string;
  township: string;
  neighborhood: POIMeta;
  street: string;
  building: POIMeta;
  level: string;
  number: string;
}

export interface AMapGeoList {
  status: string;
  count: string;
  info: string;
  infocode: string;
  geocodes: GeoCode[];
}
