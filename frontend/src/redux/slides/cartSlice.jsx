import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    productsSelected: [],
    itemsPrice: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateCart: (state, action) => {
            state.products = action.payload.products
            state.totalAmount = action.payload.totalAmount
        },
        addProductToCart: (state, action) => {
            const newProduct = action.payload.product
            const count = action.payload.quantity
            const existProduct = state.products.find(p => p.productId._id === newProduct._id)
            if (existProduct) {
                existProduct.quantity += count
            } else {
                let data = {
                    productId: {
                        _id: newProduct._id,
                        name: newProduct.name,
                        image: newProduct.image,
                        quantity: newProduct.quantity,
                        price: newProduct.price
                    },
                    quantity: count
                }
                state.products.push(data)
            }
        },
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload

            const itemOrder = state?.products?.filter((item) => item?.productId._id !== idProduct)
            const itemOrderSeleted = state?.productsSelected?.filter((item) => item?.productId._id !== idProduct)

            state.products = itemOrder;
            state.productsSelected = itemOrderSeleted;
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action.payload

            const itemOrders = state?.products?.filter((item) => !listChecked.includes(item.productId._id))
            //const itemOrdersSelected = state?.products?.filter((item) => !listChecked.includes(item.productId._id))
            state.products = itemOrders
            state.productsSelected = []
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const productIndex = state?.products?.findIndex((pd) => pd?.productId._id === idProduct)
            if (productIndex !== -1) {
                state.products[productIndex].quantity += 1;
                //state.totalAmount += 1;
            }
            const productsSelectedIndex = state?.productsSelected?.findIndex((item) => item?.productId._id === idProduct)
            if (productsSelectedIndex != -1) {
                state.productsSelected[productsSelectedIndex].quantity += 1;
            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const productIndex = state?.products?.findIndex((pd) => pd?.productId._id === idProduct)
            if (productIndex !== -1) {
                state.products[productIndex].quantity -= 1;
                //state.totalAmount += 1;
            }
            const productsSelectedIndex = state?.productsSelected?.findIndex((item) => item?.productId._id === idProduct)
            if (productsSelectedIndex != -1) {
                state.productsSelected[productsSelectedIndex].quantity -= 1;
            }
        },
        selectedOrder: (state, action) => {
            const { listChecked } = action.payload
            const orderSelected = []
            state.products.forEach((pd) => {
                if (listChecked.includes(pd.productId._id)) {
                    orderSelected.push(pd)
                };
            });
            state.productsSelected = orderSelected
        }
    }
})

export const { updateCart, addProductToCart, removeAllOrderProduct, increaseAmount, decreaseAmount, removeOrderProduct, selectedOrder } = cartSlice.actions

export default cartSlice.reducer;