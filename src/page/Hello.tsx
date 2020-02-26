import { createCell } from 'web-cell';

export function Hello({ name = 'World' }) {
  return <h1>Hello, {name}!</h1>;
}
