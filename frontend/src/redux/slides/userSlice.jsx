import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    access_token: '',
    id: '',
    role: '',
    refreshToken: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', access_token = '', address = '', phoneNumber = '', _id = '', role = '', refreshToken = '' } = action.payload
            state.name = name ? name : state.name;
            state.email = email ? email : state.email;
            state.address = address ? address : state.address;
            state.phoneNumber = phoneNumber ? phoneNumber : state.phoneNumber;
            state.id = _id ? _id : state.id
            state.access_token = access_token ? access_token : state.access_token;
            state.role = role ? role : state.role;
            state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.address = '';
            state.phoneNumber = '';
            state.id = '';
            state.access_token = '';
            state.role = '';
            state.refreshToken = ''
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer