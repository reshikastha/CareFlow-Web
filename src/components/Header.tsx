import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import '../styles/dashboard.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="top-header">
      <button
        className="mobile-menu-button"
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="search-box">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search workers, clients, shifts..."
        />
      </div>

      <div className="header-actions">
        <button
          className="notification-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={21} />
          <span />
        </button>

        <div className="profile-avatar">R</div>

        <div className="profile-information">
          <strong>Reshika</strong>
          <span>Admin</span>
        </div>

        <button
          className="profile-menu-button"
          type="button"
          aria-label="Open profile menu"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;