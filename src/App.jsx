import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthContainer from './components/Auth/AuthContainer';
import LinkContainer from './components/Links/LinkContainer';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header/Header';
import './App.css';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#121212]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DB4551]"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#131315] font-[Space_Grotesk]">
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#21262D',
          color: '#FFFFFF',
          borderRadius: '16px',
        },
      }} />
      <Header />
      <main className="container mx-auto px-4 pb-24 max-w-3xl">
        {user ? (
          <LinkContainer />
        ) : (
          <AuthContainer />
        )}
      </main>
    </div>
  );
}

export default App;
