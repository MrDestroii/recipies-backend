import * as R from 'ramda';

export const getLowerStringFromObject: (value: string) => string = R.compose(
  R.toLower,
  R.defaultTo(''),
);
