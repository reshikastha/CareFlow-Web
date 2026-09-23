import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import '../styles/dashboard.css';
import { useNavigate } from "react-router-dom";
import { getProfile, type UserProfile } from "../services/profileApi";
import {
  useEffect,
  useState,
} from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

function Header({ onMenuClick }: HeaderProps) {

  const navigate = useNavigate()

const [profile, setProfile] = useState<UserProfile | null>(null);


useEffect(() => {
  const loadProfile = async () => {
    try {

      // Wait for profile data from the backend.
      const profileData = await getProfile();
      // Save the returned profile in state.
      setProfile(profileData);
    } catch (error) {
      console.log("Unable to load your profile.")
    } 
  };

  loadProfile();
}, []);


  const getInitials = (fullName: any) => {
    return fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name: any) => name.charAt(0).toUpperCase())
      .join("");
  };

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


      <div className="profile-div" onClick={()=> navigate("/carer/profile/edit")}>
        {/* {profile?.image ? (
                  <img
                    className="large-profile-avatar profile-image"
                    src={profile?.image}
                    alt={profile?.fullName}
                  />
                ) : (
                  <div className="profile-avatar">
                    {getInitials(profile?.fullName)}
                  </div>
                )} */}


        <div className="profile-information" >
          <strong>{profile?.fullName}</strong>
          <span>{profile?.role}</span>
        </div>
      </div>
        {/* <button
          className="profile-menu-button"
          type="button"
          aria-label="Open profile menu"
        >
          <ChevronDown size={20} />
        </button> */}
      </div>
    </header>
  );
}

export default Header;