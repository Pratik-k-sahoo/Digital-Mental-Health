import { createSlice } from "@reduxjs/toolkit";

const anonymizationSlice = createSlice({
	name: "anonymization",
	initialState: {
		isAnonymized: true,
	},
	reducers: {
		setAnonymized: (state, action) => {
			state.isAnonymized = action.payload;
		},
		isAnonymized: (state) => {
			state.isAnonymized = !state.isAnonymized;
		},
	},
});

export const { setAnonymized, isAnonymized } = anonymizationSlice.actions;
export default anonymizationSlice.reducer;
