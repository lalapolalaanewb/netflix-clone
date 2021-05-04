import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import userReducer from '../features/userSlice'
import subReducer from '../features/subSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    sub: subReducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  })
})
