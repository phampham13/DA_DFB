import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slides/productSlice'
import userReducer from './slides/userSlice'
import borrowerCardReducer from './slides/borrowerCardSlice'
import cartReducer from './slides/cartSlice'


export default configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    borrowerCard: borrowerCardReducer,
    cart: cartReducer
  }
})