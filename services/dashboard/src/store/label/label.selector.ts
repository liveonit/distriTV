import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../rootReducer';
import { LabelT } from './label.type';

export const labelsIsLoadingSelector = createSelector(
  (state: RootState) => state.label,
  (label) => label.isLoading,
);

export const labelsSelector = createSelector(
  (state: RootState) => state.label,
  (label) => label.items as LabelT[],
  );
