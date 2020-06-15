import * as R from 'ramda'

export const getLowerStringFromObject = R.compose(R.toLower, R.defaultTo(''))