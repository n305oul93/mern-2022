/* auth folder represents auth part of global state;
authSlice is where reducers, initial state, and other
that pertain to authentication
*/

// in redux install the Thunk package & mw in order
// to have async functions & update state
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

/* When login > from server get basic user data including a JWT
which is needed to access protected routes; get & save to localStorage
 */
// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  // this pertains to user part of state or authentication
  // if there is user in localStorage use it, if not null
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

export const authSlice = createSlice({
  name: 'auth', //name of slice
  initialState,
  // anything place in reducers are not async nor Thunk functions
  // those go in function called extraReducers
  reducers: {
    // this is used to reset state to initial values
    reset: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    }
  },
  extraReducers: () => {}
})

export const { reset } = authSlice.actions
export default authSlice.reducer
