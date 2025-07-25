import {jwtDecode} from 'jwt-decode';

export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (err) {
    return false;
  }
};

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    
    return jwtDecode(token); // { id, name, email, exp }
  } catch (err) {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};
