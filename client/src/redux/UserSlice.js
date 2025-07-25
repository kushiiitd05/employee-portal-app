import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  id: '',
  address: '',
  profileImage: null,
  token: '',
  isAuthenticated: false,
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { name, id, email, token, profileImage } = action.payload;
      state.name = name;
      state.id = id;
      state.email = email;
      state.token = token;
      state.profileImage = profileImage || '';
      state.isAuthenticated = true;
    },
    updateProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
     clearUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, updateProfileImage, clearUser } = UserSlice.actions;
export default UserSlice.reducer;
