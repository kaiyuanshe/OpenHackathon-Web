import { Second, Minute, Hour, Day, Week, Month, Year } from 'web-utility';

export const TimeUnit = new Map([
  ['秒', Second],
  ['分', Minute],
  ['时', Hour],
  ['天', Day],
  ['周', Week],
  ['月', Month],
  ['年', Year],
]);

export const convertDatetime = (datetime = '') => {
  return datetime && new Date(datetime).toLocaleString();
};
