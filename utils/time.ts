import { Day, Hour, Minute, Month, Second, Week, Year } from 'web-utility';

export const TimeUnit = new Map([
  ['秒', Second],
  ['分', Minute],
  ['时', Hour],
  ['天', Day],
  ['周', Week],
  ['月', Month],
  ['年', Year],
]);

export const convertDatetime = (datetime = '') =>
  datetime && new Date(datetime).toLocaleString();
