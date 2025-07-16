/**
 * filesize
 *
 * @copyright 2018 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.6.1
 */

type FilesizeDescriptor = {
  bits?: boolean;
  unix?: boolean;
  base?: 2 | 10;
  round?: number;
  separator?: string;
  spacer?: string;
  symbols?: Record<string, string>;
  suffixes?: Record<string, string>;
  standard?: 'iec' | 'jedec';
  output?: 'string' | 'array' | 'exponent' | 'object';
  fullform?: boolean;
  fullforms?: string[];
  exponent?: number;
};

const b = /^(b|B)$/;
const symbol = {
  iec: {
    bits: ['b', 'Kib', 'Mib', 'Gib', 'Tib', 'Pib', 'Eib', 'Zib', 'Yib'],
    bytes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
  },
  jedec: {
    bits: ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],
    bytes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  },
};
const fullform = {
  iec: ['', 'kibi', 'mebi', 'gibi', 'tebi', 'pebi', 'exbi', 'zebi', 'yobi'],
  jedec: ['', 'kilo', 'mega', 'giga', 'tera', 'peta', 'exa', 'zetta', 'yotta'],
};

export function filesize(
  arg: string | number,
  descriptor: FilesizeDescriptor = {},
):
  | string
  | [number, string]
  | number
  | { value: number; suffix: string; symbol: string } {
  const result: [number | string, string] = [0, ''];
  let val = 0;
  const bits = descriptor.bits === true;
  const unix = descriptor.unix === true;
  const base = descriptor.base || 2;
  const round =
    descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
  const separator =
    descriptor.separator !== undefined ? descriptor.separator || '' : '';
  const spacer =
    descriptor.spacer !== undefined ? descriptor.spacer : unix ? '' : ' ';
  const symbols = descriptor.symbols || descriptor.suffixes || {};
  const standard: 'iec' | 'jedec' =
    base === 2 ? descriptor.standard || 'jedec' : 'jedec';
  const output = descriptor.output || 'string';
  const full = descriptor.fullform === true;
  const fullforms = Array.isArray(descriptor.fullforms)
    ? descriptor.fullforms
    : [];
  let e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
  let num = Number(arg);
  const neg = num < 0;
  const ceil = base > 2 ? 1000 : 1024;

  if (isNaN(num)) {
    throw new Error('Invalid arguments');
  }

  // Flipping a negative number to determine the size
  if (neg) {
    num = -num;
  }

  // Determining the exponent
  if (e === -1 || isNaN(e)) {
    e = Math.floor(Math.log(num) / Math.log(ceil));
    if (e < 0) e = 0;
  }

  if (e > 8) e = 8;

  if (num === 0) {
    result[0] = 0;
    result[1] = unix
      ? ''
      : (symbol[standard][bits ? 'bits' : 'bytes'][e] as string) || '';
  } else {
    val = num / (base === 2 ? Math.pow(2, e * 10) : Math.pow(1000, e));
    if (bits) {
      val = val * 8;
      if (val >= ceil && e < 8) {
        val = val / ceil;
        e++;
      }
    }
    result[0] = Number(val.toFixed(e > 0 ? round : 0));
    result[1] =
      base === 10 && e === 1
        ? bits
          ? 'kb'
          : 'kB'
        : (symbol[standard][bits ? 'bits' : 'bytes'][e] as string) || '';

    if (unix) {
      result[1] =
        standard === 'jedec'
          ? result[1].charAt(0)
          : e > 0
            ? result[1].replace(/B$/, '')
            : result[1];

      if (b.test(result[1])) {
        result[0] = Math.floor(Number(result[0]));
        result[1] = '';
      }
    }
  }

  if (neg) {
    result[0] = -Number(result[0]);
  }

  result[1] = symbols[result[1]] || result[1];

  if (output === 'array') {
    return [Number(result[0]), result[1]];
  }
  if (output === 'exponent') {
    return e;
  }
  if (output === 'object') {
    return { value: Number(result[0]), suffix: result[1], symbol: result[1] };
  }
  if (full) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[1] = fullforms[e]
      ? fullforms[e]
      : ((fullform[standard][e] as string) || '') +
        (bits ? 'bit' : 'byte') +
        (Number(result[0]) === 1 ? '' : 's');
  }
  if (separator.length > 0) {
    result[0] = result[0]?.toString().replace('.', separator);
  }
  return [result[0], result[1]].join(spacer);
}

// Partial application for functional programming
filesize.partial = function (opt: FilesizeDescriptor) {
  return function (arg: string | number) {
    return filesize(arg, opt);
  };
};
