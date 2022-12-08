import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../rootReducer';
import { ContentT } from './content.type';

export const contentIsLoadingSelector = createSelector(
  (state: RootState) => state.content,
  (content) => content.isLoading,
);

export const contentSelector = createSelector(
  (state: RootState) => state.content,
  (content) => content.items as ContentT[],
  );
