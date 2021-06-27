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
