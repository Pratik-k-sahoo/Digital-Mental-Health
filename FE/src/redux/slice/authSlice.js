import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
	},
	reducers: {
		login: (state, action) => {
			state.user = action.payload;
		},
		logout: (state) => {
			state.user = null;
		},
		updateUser: (state, action) => {
			state.user = {
				...state.user,
				...action.payload,
			};
		},
	},
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
