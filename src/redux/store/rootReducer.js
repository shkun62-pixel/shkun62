import { combineReducers } from '@reduxjs/toolkit';
import saleReducer from '../slice/sale/saleSlice';

const rootReducer = combineReducers({
  sales: saleReducer,
});

export default rootReducer;