import 'core-js/es/string/match-all';
import { HTTPClient } from 'koajax';

export const service = new HTTPClient({
    baseURI: 'https://hacking.kaiyuanshe.cn:15000/api/',
    responseType: 'json'
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
