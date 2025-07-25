// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { setUser } from './redux/UserSlice'; // ✅ Import the setUser action
import App from './App.jsx';
import './index.css';

// window.global = window;
// window.global = window;


const userData = localStorage.getItem('user');
if (userData) {
  // If data is found, it re-populates the Redux store with it.
  // This effectively "re-logs" you in on the frontend.
  store.dispatch(setUser(JSON.parse(userData)));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);