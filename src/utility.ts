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
