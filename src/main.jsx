// src/main.jsx (hoặc index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthContext.jsx'; // 👉 Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👉 Bọc AuthProvider quanh App */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);