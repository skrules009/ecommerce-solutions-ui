import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 'shipping', // 'shipping' | 'payment' | 'review'
  shippingAddress: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  },
  paymentMethod: {
    type: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  },
  isLoading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload };
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = { ...state.paymentMethod, ...action.payload };
    },
    checkoutStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    checkoutSuccess: (state) => {
      state.isLoading = false;
    },
    checkoutFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const {
  setStep,
  setShippingAddress,
  setPaymentMethod,
  checkoutStart,
  checkoutSuccess,
  checkoutFailure,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
