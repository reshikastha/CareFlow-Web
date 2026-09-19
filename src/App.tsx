import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import Roster from "./pages/Roster";
import Workers from "./pages/Workers";
import Clients from "./pages/Clients";
import Incidents from "./pages/Incidents";
import IncidentReview from "./pages/IncidentReview";
import Report from "./pages/Reports";
import CarerDashboard from "./pages/CarerDashboard";
import MyShifts from "./pages/MyShifts";
import ShiftDetails from "./pages/ShiftDetails";
import MyClients from "./pages/MyClients";
import Availability from "./pages/Availability";
import LeaveRequests from "./pages/LeaveRequests";
import CarerIncidents from "./pages/CarerIncidents";
import ReportIncident from "./pages/ReportIncident";
import MyProfile from "./pages/MyProfile";
// import "./styles/auth.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admindashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admindashboard" element={<Dashboard />} />
        <Route path="/roster" element={<Roster />} />
          <Route path="/workers" element={<Workers />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/incidents" element={<Incidents />} />
         <Route path="/reports" element={<Report />} />
        <Route
          path="/incidents/:incidentId"
          element={<IncidentReview />}
        />

  {/* Care worker */}
      <Route path="/carer" element={<Navigate to="/carer/dashboard" replace />}/>
      <Route path="/carer/dashboard" element={<CarerDashboard />}/>
      <Route path="/carer/shifts" element={<MyShifts />}/>
      <Route path="/carer/shifts/:shiftId" element={<ShiftDetails />}/>
      <Route path="/carer/clients" element={<MyClients />}/>
      <Route path="/carer/availability"  element={<Availability />}/>
      <Route path="/carer/leave" element={<LeaveRequests />}/>
      <Route path="/carer/incidents" element={<CarerIncidents />}/>
      <Route path="/carer/incidents/report" element={<ReportIncident />}/>
      <Route  path="/carer/profile"  element={<MyProfile />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
