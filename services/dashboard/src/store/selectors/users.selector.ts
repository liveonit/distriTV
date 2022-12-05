import { createSelector } from '@reduxjs/toolkit';

import { UserT } from '../models/Global';
import { RootState } from '../reducer';

export const usersIsLoadingSelector = createSelector(
  (state: RootState) => state.users,
  (users) => users.isLoading,
);

export const usersSelector = createSelector(
  (state: RootState) => state.users,
  (users) => users.users as UserT[],
);
