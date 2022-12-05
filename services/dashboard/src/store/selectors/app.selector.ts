import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../reducer';

export const isLoadingSelector = createSelector(
  (state: RootState) => state.app,
  (app) => app.isLoading,
);

export const dialogSelector = createSelector(
  (state: RootState) => state.app,
  (app) => app.dialog,
);

export const notificationsSelector = createSelector(
  (state: RootState) => state.app,
  (app) => app.notifications,
);
