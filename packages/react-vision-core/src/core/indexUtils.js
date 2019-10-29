import { omit } from './utils';

export function getIndexId(context) {
  return hasMultipleIndices(context)
    ? context.multiIndexContext.targetedIndex
    : context.cvi.mainTargetedIndex;
}
