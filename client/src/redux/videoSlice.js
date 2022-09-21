import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentVideo: null,
    isLoading: true,
    isError: false
};


const videoSlice = createSlice({
    name: "video",
    initialState: initialState,
    reducers: {
        fetchStart: (state) => {
            state.isLoading = true;
        },
        fetchSuccess: (state, action) => {
            state.isLoading = false;
            state.currentVideo = action.payload;
            state.isError = false;
        },
        fetchFailure: (state) => {
            state.isLoading = false;
            state.isError = true;
        },
        updateLikes: (state, action) => {
            if (!state.currentVideo.likes.includes(action.payload)) {
                state.currentVideo.likes.push(action.payload);
                state.currentVideo.dislikes.splice(
                    state.currentVideo.dislikes.findIndex(
                        (userId) => userId === action.payload
                    ),
                    1
                )
            }
        },
        updateDisLikes: (state, action) => {
            if (!state.currentVideo.dislikes.includes(action.payload)) {
                state.currentVideo.dislikes.push(action.payload);
                state.currentVideo.likes.splice(
                    state.currentVideo.likes.findIndex(
                        (userId) => userId === action.payload
                    ),
                    1
                )
            }
        },
    },
});

export const { fetchStart, fetchSuccess, fetchFailure, updateDisLikes, updateLikes } = videoSlice.actions;
export default videoSlice.reducer