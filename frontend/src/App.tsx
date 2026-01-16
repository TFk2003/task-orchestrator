import React, { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import WorkersPage from './pages/WorkersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Header from './components/common/Header/Header';
import Sidebar from './components/common/Sidebar/Sidebar';
import { View } from './types/common.types';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tasks':
        return <TasksPage />;
      case 'workers':
        return <WorkersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <div className="page-container"><h1>Settings Page</h1></div>;
      default:
        return <DashboardPage />;
    }
  };
  return (
    <div className="App">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Header 
        activeView={activeView} 
        onViewChange={setActiveView} 
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className={`app-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {renderView()}
      </main>

      <footer className={`app-footer ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <p>© 2026 Task Orchestrator - Distributed Microservices System</p>
      </footer>
    </div>
  );
}

export default App;
