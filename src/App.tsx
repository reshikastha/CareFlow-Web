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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
