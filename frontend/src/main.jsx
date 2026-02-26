import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <SearchProvider> {/* Add this */}
            <App />
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);