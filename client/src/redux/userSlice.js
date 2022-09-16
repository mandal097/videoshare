import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    isLoading: false,
    isError: false
};


const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
            state.isError = false;
        },
        loginFailure: (state) => {
            state.isLoading = false;
            state.isError = true;
        },
        logout: (state) => {
            state.user = null;
            state.isLoading = false;
            state.isError = false;
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer