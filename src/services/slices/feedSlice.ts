import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

/** Получение списка всех заказов */
export const getFeedsThunk = createAsyncThunk('feeds/getFeeds', async () =>
  getFeedsApi()
);

/** Получение информации об одном заказе по его номеру */
export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrder',
  async (orderNumber: number) => getOrderByNumberApi(orderNumber)
);

export interface FeedState {
  orders: TOrder[];
  isFeedsLoading: boolean;
  order: TOrder | null;
  isOrderLoading: boolean;
  total: number;
  totalToday: number;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  isFeedsLoading: false,
  order: null,
  isOrderLoading: false,
  total: 0,
  totalToday: 0,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    ordersSelector: (state) => state.orders,
    isFeedsLoadingSelector: (state) => state.isFeedsLoading,
    orderSelector: (state) => state.order,
    isOrderLoadingSelector: (state) => state.isOrderLoading,
    totalSelector: (state) => state.total,
    totalTodaySelector: (state) => state.totalToday
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.isFeedsLoading = true;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.isFeedsLoading = false;
        state.error = action.error.message!;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.isFeedsLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });

    builder
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.error = action.error.message!;
        state.isOrderLoading = false;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.isOrderLoading = false;
      });
  }
});

export const {
  ordersSelector,
  isFeedsLoadingSelector,

  orderSelector,
  isOrderLoadingSelector,

  totalSelector,
  totalTodaySelector
} = feedSlice.selectors;
export default feedSlice.reducer;
