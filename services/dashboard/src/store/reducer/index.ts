import { combineReducers } from 'redux';

import authors from '../factory/entities/authors'
import books from '../factory/entities/books'
import auth from './auth.reducer';
import app from './app.reducer';
import users from './users.reducer'
export const rootReducer = combineReducers({
  authors: authors.reducer,
  books: books.reducer,
  auth,
  app,
  users
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
