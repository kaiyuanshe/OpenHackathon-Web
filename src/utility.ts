export const isMobile = 'ontouchend' in document.documentElement;

export enum TimeUnitName {
    ms = '毫秒',
    s = '秒',
    m = '分钟',
    H = '小时',
    D = '日',
    W = '周',
    M = '月',
    Y = '年'
}

export function importJS(URI: string) {
    var script = [...document.scripts].find(({ src }) => src === URI);

    if (script) return Promise.resolve(script);

    script = document.createElement('script');

    return new Promise<HTMLScriptElement>((resolve, reject) => {
        (script.onload = () => resolve(script)), (script.onerror = reject);

        script.src = URI;

        document.head.append(script);
    });
}

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
