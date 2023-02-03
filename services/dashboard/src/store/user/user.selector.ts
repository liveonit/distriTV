import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../rootReducer';
import { UserT } from './user.type';

export const usersIsLoadingSelector = createSelector(
  (state: RootState) => state.user,
  (user) => user.isLoading,
);

export const usersSelector = createSelector(
  (state: RootState) => state.user,
  (user) => user.items as UserT[],
);
