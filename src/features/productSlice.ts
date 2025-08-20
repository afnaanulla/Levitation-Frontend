import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  qty: number;
  rate: number;
  total: number;
  gst: number;
}

export interface ProductState {
  products: Product[];
}

const initialState: ProductState = {
  products: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Omit<Product, 'id' | 'total' | 'gst'>>) => {
      const { name, qty, rate } = action.payload;
      const total = qty * rate;
      const gst = total * 0.18;
      
      state.products.push({
        id: Date.now().toString(),
        name,
        qty,
        rate,
        total,
        gst,
      });
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(product => product.id !== action.payload);
    },
    clearProducts: (state) => {
      state.products = [];
    },
  },
});

export const { addProduct, removeProduct, clearProducts } = productSlice.actions;
export default productSlice.reducer;