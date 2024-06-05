import React, { useContext } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { socketContext } from './providers/SocketProvider';
export default function Layout() {
    return (
      <div className="container">
        <div className="content-container">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    );
  }