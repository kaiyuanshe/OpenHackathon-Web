import { zh_CN } from './zh-CN';
import { zh_TW } from './zh-TW';
import { en_US } from './en-US';

export function createI18nScope<T extends Record<string, string>>(
    data: Record<string, T>,
    fallback = 'en-US'
) {
    const meta: T = Object.assign(
        {},
        ...[...navigator.languages, fallback].reverse().map(name => data[name])
    );
    return {
        i18nTextOf: (key: keyof T) => meta[key] || ''
    };
}

export const { i18nTextOf } = createI18nScope({
    'zh-CN': zh_CN,
    'zh-TW': zh_TW,
    'en-US': en_US
});
