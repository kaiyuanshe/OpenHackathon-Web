export interface Base {
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  name: string;
  description: string;
  uri: string;
}

export interface ListData<T> {
  nextLink: string;
  value: T[];
}

const Host = process.env.NEXT_PUBLIC_API_HOST;

export async function request<T>(path: string) {
  const response = await fetch(new URL(path, Host) + '');

  const data = await response.json();

  return data as T;
}
