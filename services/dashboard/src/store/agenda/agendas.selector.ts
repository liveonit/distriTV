import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../rootReducer';
import { AgendaT } from './agenda.type';

export const agendasIsLoadingSelector = createSelector(
  (state: RootState) => state.agenda,
  (agenda) => agenda.isLoading,
);

export const agendasSelector = createSelector(
  (state: RootState) => state.agenda,
  (agenda) => agenda.items as AgendaT[],
  );
