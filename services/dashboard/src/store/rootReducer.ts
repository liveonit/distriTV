import { combineReducers } from 'redux';

import authors from './factory/entities/authors'
import books from './factory/entities/books'
import auth from './reducer/auth.reducer';
import app from './reducer/app.reducer';

export const rootReducer = combineReducers({
  authors: authors.reducer,
  books: books.reducer,
  auth,
  app
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
