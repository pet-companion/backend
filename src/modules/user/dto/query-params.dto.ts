import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

const toNumber = (value: string, opts: ToNumberOptions = {}): number => {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
};

export class QueryParamsDto {
  @Transform(({ value }) => toNumber(value, { default: 10, min: 1, max: 100 }))
  @IsOptional()
  limit = 10;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  page = 1;
}

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}
