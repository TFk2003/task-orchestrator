import React from 'react';
import { Activity, Menu, X } from 'lucide-react';
import './Header.css';
import { View } from '../../../types/common.types';

interface HeaderProps {
  activeView: View;
  onViewChange: (view: View) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange, sidebarOpen, onSidebarToggle }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  return (
    <header className={`app-header ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="header-content">
        <div className="logo">
          <button 
            className="sidebar-toggle-btn"
            onClick={onSidebarToggle} // Add this prop to Header
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu size={24} /> {/* Or use an icon library */}
          </button>
          <Activity className="logo-icon" />
          <h1>Task Orchestrator</h1>
        </div>
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
        <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button
            className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('dashboard');
              setMobileMenuOpen(false);
            }}
          >
            Dashboard
          </button>
          <button
            className={`nav-link ${activeView === 'tasks' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('tasks');
              setMobileMenuOpen(false);
            }}
          >
            Tasks
          </button>
          <button
            className={`nav-link ${activeView === 'workers' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('workers');
              setMobileMenuOpen(false);
            }}
          >
            Workers
          </button>
          <button
            className={`nav-link ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('analytics');
              setMobileMenuOpen(false);
            }}
          >
            Analytics
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;