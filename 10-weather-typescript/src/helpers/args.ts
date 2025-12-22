import type { CliArgs, Lang } from '../types.js';

export const getArgs = (args: string[]): CliArgs => {
  const res: Partial<CliArgs> = {};
  const [_exec, _file, ...rest] = args;

  for (let i = 0; i < rest.length; i++) {
    const val = rest[i];
    if (typeof val !== 'string' || !val.startsWith('-')) {
      continue;
    }

    const key = val.substring(1);
    const next = rest[i + 1];

    let value: string | boolean = true;

    if (next && typeof next === 'string' && !next.startsWith('-')) {
      value = next;
      i++; 
    }

    switch (key) {
      case 'h':
        res.h = true;
        break;
      case 't':
        if (typeof value === 'string') res.t = value;
        break;
      case 's':
        if (typeof value === 'string') res.s = value;
        break;
      case 'l':
        if (typeof value === 'string' && (value === 'ru' || value === 'en')) {
          res.l = value as Lang;
        }
        break;
    }
  }

  return res as CliArgs;
};