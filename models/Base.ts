export interface Base {
  id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  name: string;
  description: string;
  uri: string;
}

export interface ErrorData {
  type: string;
  title: string;
  status: number;
  detail: string;
  traceId: string;
}

export interface ListData<T> {
  nextLink: string;
  value: T[];
}
