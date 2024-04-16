import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
export default function Layout() {
    return (
      <div className="app-container">
        <Header />
        <div className="content-container">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    );
  }