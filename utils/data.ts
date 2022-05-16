import { TypeKeys } from 'web-utility';

export function findDeep<T>(
  list: T[],
  subKey: TypeKeys<Required<T>, any[]>,
  handler: (item: T) => boolean,
): T[] {
  for (const item of list) {
    if (handler(item)) return [item];

    if (item[subKey] instanceof Array) {
      const result = findDeep(item[subKey] as unknown as T[], subKey, handler);

      if (result.length) return [item, ...result];
    }
  }
  return [];
}
