import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../rootReducer';
import { PermissionT } from './permission.type';

export const permissionIsLoadingSelector = createSelector(
  (state: RootState) => state.permission,
  (permission) => permission.isLoading,
);

export const permissionSelector = createSelector(
  (state: RootState) => state.permission,
  (permission) => permission.items as PermissionT[],
);
