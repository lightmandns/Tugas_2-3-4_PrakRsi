export const isPositiveId = (value: number) => Number.isInteger(value) && value > 0;

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const assertResourceExists = <T>(row: T | undefined): T => {
  if (!row) throw new Error('RESOURCE_NOT_FOUND');
  return row;
};
