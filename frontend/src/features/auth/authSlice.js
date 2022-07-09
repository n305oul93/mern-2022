/* auth folder represents auth part of global state;
authSlice is where reducers, initial state, and other
that pertain to authentication
*/

// in redux install the Thunk package & mw in order
// to have async functions & update state
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

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

// Register User
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Login User
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Logout User
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

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
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, state => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(logout.fulfilled, state => {
        state.user = null
      })
  }
})

export const { reset } = authSlice.actions
export default authSlice.reducer
