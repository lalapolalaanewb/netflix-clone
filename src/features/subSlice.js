import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sub: null
}

export const subSlice = createSlice({
  name: 'sub',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // login
    updateSub: (state, action) => {
      state.sub = action.payload
    }
  }
});

export const { updateSub } = subSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectSub = (state) => state.sub.sub;

export default subSlice.reducer;
