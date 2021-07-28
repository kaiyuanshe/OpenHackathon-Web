import { HTTPClient, HTTPError, Response } from 'koajax';

export interface ErrorData {
    status: number;
    title?: string;
    type: string;
    traceId: string;
    detail?: string;
    errors?: Record<string, string[]>;
}

export type APIError = HTTPError<ErrorData>;

const { localStorage } = self;

var token: string = localStorage.token || '',
    expiredAt = new Date(localStorage.expiredAt || '');

export function setToken(raw: string, deadline: string) {
    localStorage.token = token = raw;
    localStorage.expiredAt = expiredAt = new Date(deadline);
}

export const service = new HTTPClient({
    baseURI: 'https://hackathon-api.kaiyuanshe.cn/v2/',
    responseType: 'json'
}).use(async ({ request, response }, next) => {
    if (token) {
        if (Date.now() >= +expiredAt)
            throw Object.assign(new URIError('Token timed out'), {
                status: 401
            });
        (request.headers = request.headers || {})[
            'Authorization'
        ] = `token ${token}`;
    }

    try {
        await next();
    } catch {
        const { body } = response as Response<ErrorData>;

        const message = body
            ? body.errors
                ? Object.values(body.errors).flat().join('\n')
                : body.detail
            : 'Bad connection to the OHP server';

        throw Object.assign(new URIError(message), response);
    }
});

export interface ListFilter<T extends DataItem = DataItem> {
    search?: string;
    orderby?: keyof T;
    top?: number;
    [key: string]: any;
}

export interface DataItem {
    id: string;
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
    name?: string;
    description?: string;
    uri: string;
}
