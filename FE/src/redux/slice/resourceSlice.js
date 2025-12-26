import { createSlice } from "@reduxjs/toolkit";

const resourceSlice = createSlice({
	name: "resource",
	initialState: {
		resources: [],
	},
	reducers: {
		setResources: (state, action) => {
			state.resources = action.payload;
		},
		logout: (state) => {
			state.resources = [];
		},
	},
});

export const { setResources, logout } = resourceSlice.actions;
export default resourceSlice.reducer;
