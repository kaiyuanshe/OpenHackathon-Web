import {
  Day,
  formatDate,
  Hour,
  Minute,
  Month,
  Second,
  Week,
  Year,
} from 'web-utility';

import { i18n } from '../models/Base/Translation';

const { t } = i18n;

export const TimeUnit = () =>
  new Map([
    [t('Second'), Second],
    [t('Minute'), Minute],
    [t('Hour'), Hour],
    [t('Day'), Day],
    [t('Week'), Week],
    [t('Month'), Month],
    [t('Year'), Year],
  ]);

export const convertDatetime = (datetime = '') =>
  datetime && formatDate(datetime);
