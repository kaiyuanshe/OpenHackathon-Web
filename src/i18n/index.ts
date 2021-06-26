import { createI18nScope } from '../utility';

import { zh_CN } from './zh-CN';
import { zh_TW } from './zh-TW';
import { en_US } from './en-US';

export const { i18nTextOf } = createI18nScope({
    'zh-CN': zh_CN,
    'zh-SG': zh_CN,
    'zh-TW': zh_TW,
    'zh-HK': zh_TW,
    'zh-MO': zh_TW,
    'en-US': en_US
});
