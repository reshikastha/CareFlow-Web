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
} from "lucide-react";

import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import '../styles/dashboard.css';

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
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
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <BrandLogo />

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
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