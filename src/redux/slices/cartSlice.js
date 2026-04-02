import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalPrice: 0,
    totalItems: 0,
    lastUpdated: null,
    shippingCost: 0,
    tax: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            state.items.push(item);
            state.totalItems += 1;
            state.totalPrice += item.price;
            state.lastUpdated = new Date().toISOString();
        },
        removeFromCart: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload);
            if (index > -1) {
                state.totalPrice -= state.items[index].price;
                state.items.splice(index, 1);
                state.totalItems -= 1;
                state.lastUpdated = new Date().toISOString();
            }
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                const priceDifference = (quantity - item.quantity) * item.price;
                state.totalPrice += priceDifference;
                item.quantity = quantity;
                state.lastUpdated = new Date().toISOString();
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.totalItems = 0;
            state.lastUpdated = new Date().toISOString();
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;