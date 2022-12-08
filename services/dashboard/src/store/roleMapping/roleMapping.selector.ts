import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../rootReducer';
import { RoleMappingT } from './roleMapping.type';

export const rolesIsLoadingSelector = createSelector(
  (state: RootState) => state.role,
  (role) => role.isLoading,
);

export const rolesSelector = createSelector(
  (state: RootState) => state.role,
  (role) => role.items as RoleMappingT[],
);
