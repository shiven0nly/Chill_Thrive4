'use client';

import React, { useState } from 'react';
import HeroSection from '@/components/pages/Hero-section/page';
import LoginPage from '@/components/pages/Login/page';
import SignupPage from '@/components/pages/Signup/page';
import AboutPage from '@/components/pages/About/page';
import PricingPage from '@/components/pages/Pricing/page';
import ServicesPage from '@/components/pages/Services/page';
import BookingPage from '@/components/pages/Booking/page';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <HeroSection setCurrentPage={setCurrentPage} />;
      case 'About':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case 'Pricing':
        return <PricingPage setCurrentPage={setCurrentPage} />;
      case 'Services':
        return <ServicesPage setCurrentPage={setCurrentPage} />;
      case 'Booking':
        return <BookingPage setCurrentPage={setCurrentPage} />;
      case 'Login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'Signup':
        return <SignupPage setCurrentPage={setCurrentPage} />; // ← Added
      default:
        return <HeroSection setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {renderPage()}
    </div>
  );
}