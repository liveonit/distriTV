import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../rootReducer';
import { TelevisionT } from './television.type';

export const televisionsIsLoadingSelector = createSelector(
  (state: RootState) => state.television,
  (television) => television.isLoading,
);

export const televisionsSelector = createSelector(
  (state: RootState) => state.television,
  (television) => television.items as TelevisionT[],
  );
