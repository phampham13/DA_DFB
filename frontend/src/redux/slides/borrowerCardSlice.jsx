import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    books: [],
    booksSelected: [],
    totalAmount: 0
}

const borrowerCardSlice = createSlice({
    name: 'borrowerCard',
    initialState,
    reducers: {
        updateCard: (state, action) => {
            state.books = action.payload.books
            state.totalAmount = action.payload.totalAmount
        },
        addBookToCard: (state, action) => {
            const newBook = action.payload.book
            const count = action.payload.count
            const existBook = state.books.find(book => book.bookId.bookId === newBook.bookId)
            if (existBook) {
                existBook.quantity += count
            } else {
                let data = {
                    bookId: {
                        _id: newBook._id,
                        bookId: newBook.bookId,
                        name: newBook.name,
                        coverImg: newBook.coverImg,
                        quantityAvailable: newBook.quantityAvailable
                    },
                    quantity: count
                }
                state.books.push(data)
            }
            state.totalAmount += count
        },
        removeCardBook: (state, action) => {
            const { idBook } = action.payload

            const bookItem = state?.books?.filter((item) => item?.bookId._id !== idBook)
            const bookItemSeleted = state?.booksSelected?.filter((item) => item?.bookId._id !== idBook)

            state.books = bookItem;
            state.booksSelected = bookItemSeleted;
        },
        removeAllBook: (state, action) => {
            const { listChecked } = action.payload
            console.log("listcheckslice", listChecked)
            const bookItems = state?.books?.filter((item) => !listChecked.includes(item.bookId._id))
            //const itemOrdersSelected = state?.books?.filter((item) => !listChecked.includes(item.bookId._id))
            state.books = bookItems
            state.booksSelected = []
        },
        increaseAmount: (state, action) => {
            const { idBook } = action.payload
            const bookIndex = state?.books?.findIndex((pd) => pd?.bookId._id === idBook)
            if (bookIndex !== -1) {
                state.books[bookIndex].quantity += 1;
                //state.totalAmount += 1;
            }
            const booksSelectedIndex = state?.booksSelected?.findIndex((item) => item?.bookId._id === idBook)
            if (booksSelectedIndex != -1) {
                state.booksSelected[booksSelectedIndex].quantity += 1;
            }
        },
        decreaseAmount: (state, action) => {
            const { idBook } = action.payload
            const bookIndex = state?.books?.findIndex((pd) => pd?.bookId._id === idBook)
            if (bookIndex !== -1) {
                state.books[bookIndex].quantity -= 1;
                //state.totalAmount += 1;
            }
            const booksSelectedIndex = state?.booksSelected?.findIndex((item) => item?.bookId._id === idBook)
            if (booksSelectedIndex != -1) {
                state.booksSelected[booksSelectedIndex].quantity -= 1;
            }
        },
        selectedBook: (state, action) => {
            const { listChecked } = action.payload
            const itemsSelected = []
            state.books.forEach((b) => {
                if (listChecked.includes(b.bookId._id)) {
                    itemsSelected.push(b)
                };
            });
            state.booksSelected = itemsSelected
        },
        resetCard: (state) => {
            state.books = []
            state.booksSelected = []
            state.totalAmount = 0
        }
    }
})

export const { updateCard, addBookToCard, removeCardBook, removeAllBook, increaseAmount, decreaseAmount, resetCard, selectedBook } = borrowerCardSlice.actions

export default borrowerCardSlice.reducer
