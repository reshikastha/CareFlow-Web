import {
  BarChart3,
  CalendarDays,
  CircleHelp,
  Clock3,
  LayoutDashboard,
  Settings,
  TriangleAlert,
  UserRound,
  UsersRound,
  User,
  Calendar,
  LogOut,
  ClipboardCheck

} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { NavLink, useNavigate  } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import '../styles/dashboard.css';

import {
  getStoredUser,
  logoutUser,
} from "../services/authApi";
import { getProfile, type UserProfile } from "../services/profileApi";

const menuItems = [
  {
    name: "Admin Dashboard",
    path: "/admindashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Roster",
    path: "/roster",
    icon: CalendarDays,
  },
  {
    name: "Workers",
    path: "/workers",
    icon: UsersRound,
  },
  {
    name: "Clients",
    path: "/clients",
    icon: UserRound,
  },
  
  {
    name: "Incidents",
    path: "/incidents",
    icon: TriangleAlert,
  },
  // {
  //   name: "Reports",
  //   path: "/reports",
  //   icon: BarChart3,
  // },
  
];

const userMenu = [
 {
    name: "Dashboard",
    path: "/carer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My shifts",
    path: "/carer/shifts",
    icon: CalendarDays,
  },
  {
    name: "Clients",
    path: "/clients",
    icon: UsersRound,
  },
  {
    name: "Availability",
    path: "/carer/availability",
    icon: ClipboardCheck,
  },
  {
    name: "Leave",
    path: "/carer/leave",
    icon: CalendarDays,
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: TriangleAlert,
  },
  
  {
    name: "Profile",
    path: "/carer/profile",
    icon: UserRound,
  },
  
];

function Sidebar() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
    // Get the user saved after login.

     

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
//   // ...


  /*
   * Select the correct menu based on the user's role.
   *
   * ADMIN receives adminMenu.
   * CARE_WORKER receives carerMenu.
   */
  const selectedMenu =
    profile?.role === "ADMIN" ? menuItems : userMenu;

console.log( profile?.role)
     const handleLogout = () => {
    // Remove the token and user from localStorage.
    logoutUser();

    // Return to login and remove the current page from history.
    navigate("/login", {
      replace: true,
    });
  };

  
  return (
    <aside className="sidebar">
      <BrandLogo />

      <nav className="sidebar-nav">
        {selectedMenu?.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

     <div className="support-card">
        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={20} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
            

  
    </aside>
  );
}

export default Sidebar;