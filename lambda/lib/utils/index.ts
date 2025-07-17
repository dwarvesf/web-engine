export function htmlify(message = '', fields: Record<string, any> = {}): string {
  return Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .concat([`<br/>`, message])
    .join(`<br/>`);
}
