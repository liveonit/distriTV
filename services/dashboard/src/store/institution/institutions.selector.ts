import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../rootReducer';
import { InstitutionT } from './institution.type';

export const institutionsIsLoadingSelector = createSelector(
  (state: RootState) => state.institution,
  (institution) => institution.isLoading,
);

export const institutionsSelector = createSelector(
  (state: RootState) => state.institution,
  (institution) => institution.items as InstitutionT[],
  );
