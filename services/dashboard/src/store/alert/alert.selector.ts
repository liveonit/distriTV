import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../rootReducer';
import { AlertT } from './alert.type';

export const alertsIsLoadingSelector = createSelector(
  (state: RootState) => state.alert,
  (alert) => alert.isLoading,
);

export const alertsSelector = createSelector(
  (state: RootState) => state.alert,
  (alert) => alert.items as AlertT[],
  );
