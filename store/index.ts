import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import checkout from './checkout.slice';
import product from './product.slice';
import products from './products.slice';

export const actions = {
  checkout: checkout.actions,
  product: product.actions,
  products: products.actions
};

const rootReducer = combineReducers({
  checkout: checkout.reducer,
  product: product.reducer,
  products: products.reducer
});

export function createStore(initialState = {}): Store {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;