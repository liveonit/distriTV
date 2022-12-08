import { createSelector } from '@reduxjs/toolkit';

import { InstitutionT } from '../models/Global';
import { RootState } from '../rootReducer';

export const institutionsIsLoadingSelector = createSelector(
  (state: RootState) => state.institutions,
  (institutions) => institutions.isLoading,
);

export const institutionsSelector = createSelector(
  (state: RootState) => state.institutions,
  (institutions) => institutions.institutions as InstitutionT[],
  );
