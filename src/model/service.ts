import { HTTPClient } from 'koajax';

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

    const { body } = response;

    if (body?.error?.code > 299)
        throw Object.assign(URIError(body.error.message), body.error);
});

export interface ListFilter {
    orderby?: string;
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

export interface PageData<T> {
    value: T[];
    nextLink?: string;
}

export interface Asset {
    name: string;
    description: string;
    uri: string;
}
