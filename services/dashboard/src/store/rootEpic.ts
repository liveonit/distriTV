import { combineEpics } from 'redux-observable';

import {rootEpics} from './epic'
import authors from './factory/entities/authors';
import books from './factory/entities/books';

export const rootEpic = combineEpics(
  rootEpics,
  authors.epics,
  books.epics
);