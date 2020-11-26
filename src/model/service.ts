import { HTTPClient } from 'koajax';

const { localStorage, location } = self;

var token: string = localStorage.token || '';

export const setToken = (raw: string) => (localStorage.token = token = raw);

export const service = new HTTPClient({
    baseURI:
        // location.hostname === 'localhost'
        'http://139.219.9.2:30150/api/',
    // : 'https://hacking.kaiyuanshe.cn:15000/api/',
    responseType: 'json'
}).use(({ request }, next) => {
    if (token) {
        (request.headers = request.headers || {})['Authorization'] = token;
    }

    return next();
});

export interface ListFilter {
    order_by?: 'time';
    page?: string;
    per_page?: string;
    [key: string]: string;
}

export interface DataItem {
    id: string;
    name: string;
    creator: string;
    create_time: number;
    update_time: number;
}

export interface PageData<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
}
