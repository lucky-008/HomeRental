import React, { useState } from 'react';
import { AuthProvider } from './hooks/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import './index.css';

export default function App() {
  const [listingMode, setListingMode] = useState('buy'); // 'buy' | 'rent'
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-stone-50 font-sans">
          <Navbar
            listingMode={listingMode}
            setListingMode={setListingMode}
            onLoginClick={() => setIsLoginOpen(true)}
          />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage listingMode={listingMode} setListingMode={setListingMode} />} />
              <Route path="/properties" element={<PropertiesPage listingMode={listingMode} />} />
              <Route path="/property/:id" element={<PropertyDetailPage listingMode={listingMode} />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
          {isLoginOpen && <LoginPage onClose={() => setIsLoginOpen(false)} />}
        </div>
      </Router>
    </AuthProvider>
  );
}
