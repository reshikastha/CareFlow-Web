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
  Calendar

} from "lucide-react";

import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import '../styles/dashboard.css';

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
    name: "Schedule",
    path: "/schedule",
    icon: Clock3,
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: TriangleAlert,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  
];

const userMenu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Shifts",
    path: "/myshifts",
    icon: CalendarDays,
  },
 
  {
    name: "My Clients",
    path: "/myclients",
    icon: UsersRound,
  },
  {
    name: "Availability",
    path: "/availability",
    icon: Clock3,
  },
  {
    name: "Leave",
    path: "/leave",
    icon: Calendar,
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: TriangleAlert,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
  
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <BrandLogo />

      <nav className="sidebar-nav">
        {userMenu.map((item) => {
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

      <nav className="support-card">

        <NavLink>
          
              <span style={{margin: "50px"}}>Logout</span>
        </NavLink>
       </nav>
            

  
    </aside>
  );
}

export default Sidebar;