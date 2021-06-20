import { HTTPClient, HTTPError, Response } from 'koajax';

export interface ErrorData {
    Status: number;
    Title: string;
    Type: string;
    traceId: string;
    Detail: string;
    Extensions: { traceId: string };
    Instance?: any;
}

export type APIError = HTTPError<ErrorData>;

const { localStorage } = self;

var token: string = localStorage.token || '';

export const setToken = (raw: string) => (localStorage.token = token = raw);

export const service = new HTTPClient({
    baseURI: 'https://hackathon-api.kaiyuanshe.cn/v2/',
    responseType: 'json'
}).use(async ({ request, response }, next) => {
    if (token)
        (request.headers = request.headers || {})[
            'Authorization'
        ] = `token ${token}`;

    await next();

    const { body } = response as Response<ErrorData>;

    if (body?.Status > 299)
        throw Object.assign(new URIError(body.Detail), response);
});

export interface ListFilter<T extends DataItem = DataItem> {
    search?: string;
    orderby?: keyof T;
    top?: number;
    [key: string]: any;
}

export interface DataItem {
    id: string;
    name: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ListBox<T> {
    totalCount: number;
    list: T[];
}

export interface PageData<T> {
    value: T[];
    nextLink?: string;
}

export interface Asset {
    name: string;
    description: string;
    uri: string;
}
