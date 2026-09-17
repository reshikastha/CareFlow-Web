import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleDot,
  Clock3,
  Filter,
  MoreHorizontal,
  Plus,
  TriangleAlert,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import "../styles/incidents.css";

type Severity = "High" | "Medium" | "Low";

type IncidentStatus =
  | "Open"
  | "Under review"
  | "Action required"
  | "Closed";

interface Incident {
  id: string;
  client: string;
  worker: string;
  type: string;
  date: string;
  severity: Severity;
  status: IncidentStatus;
}

const incidents: Incident[] = [
  {
    id: "INC-024",
    client: "Aisha Foster",
    worker: "Aisha Khan",
    type: "Fall risk",
    date: "24 Jun 2025",
    severity: "High",
    status: "Under review",
  },
  {
    id: "INC-023",
    client: "Brian Lewis",
    worker: "Daniel Kim",
    type: "Medication",
    date: "24 Jun 2025",
    severity: "Medium",
    status: "Closed",
  },
  {
    id: "INC-022",
    client: "Claire Campbell",
    worker: "Priya Sharma",
    type: "Behavioural",
    date: "23 Jun 2025",
    severity: "Medium",
    status: "Action required",
  },
  {
    id: "INC-021",
    client: "David Green",
    worker: "Chris Taylor",
    type: "Client concern",
    date: "22 Jun 2025",
    severity: "Low",
    status: "Open",
  },
  {
    id: "INC-020",
    client: "Emma Hughes",
    worker: "Ben Lee",
    type: "Missed visit",
    date: "21 Jun 2025",
    severity: "Low",
    status: "Closed",
  },
  {
    id: "INC-019",
    client: "Fatima Zain",
    worker: "Eleanor Mills",
    type: "Property damage",
    date: "21 Jun 2025",
    severity: "Medium",
    status: "Under review",
  },
  {
    id: "INC-018",
    client: "Jack Lee",
    worker: "Margaret Lewis",
    type: "Environmental",
    date: "20 Jun 2025",
    severity: "Low",
    status: "Closed",
  },
  {
    id: "INC-017",
    client: "Maria Gomez",
    worker: "James Carter",
    type: "Medication",
    date: "19 Jun 2025",
    severity: "High",
    status: "Open",
  },
];

function Incidents() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <main className="page-content incidents-page">
        <section className="incidents-heading">
          <div>
            <h1>Incidents</h1>
            <p>
              View and manage all incidents, ensure follow-up and
              maintain a safe care environment.
            </p>
          </div>

          <button className="green-button" type="button">
            <Plus size={18} />
            New incident
          </button>
        </section>

        <section className="incident-stat-grid">
          <article className="incident-stat incident-stat--red">
            <CircleAlert size={30} />
            <div>
              <h2>Open</h2>
              <strong>6</strong>
              <p>Needs review</p>
            </div>
          </article>

          <article className="incident-stat incident-stat--orange">
            <Clock3 size={30} />
            <div>
              <h2>Under review</h2>
              <strong>4</strong>
              <p>In progress</p>
            </div>
          </article>

          <article className="incident-stat incident-stat--red">
            <TriangleAlert size={30} />
            <div>
              <h2>Action required</h2>
              <strong>3</strong>
              <p>Needs attention</p>
            </div>
          </article>

          <article className="incident-stat incident-stat--green">
            <CheckCircle2 size={30} />
            <div>
              <h2>Closed</h2>
              <strong>12</strong>
              <p>This month</p>
            </div>
          </article>
        </section>

        <section className="incident-table-card">
          <div className="incident-filters">
            <button type="button">
              <CalendarDays size={18} />
              Mon, 23 Jun 2025 – Sun, 29 Jun 2025
              <ChevronDown size={16} />
            </button>

            <button type="button">
              <TriangleAlert size={18} />
              All severities
              <ChevronDown size={16} />
            </button>

            <button type="button">
              <CircleDot size={18} />
              All statuses
              <ChevronDown size={16} />
            </button>

            <button type="button">
              <Filter size={18} />
              Filter
            </button>
          </div>

          <div className="table-wrapper">
            <table className="incidents-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" aria-label="Select all" />
                  </th>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Worker</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${incident.id}`}
                      />
                    </td>

                    <td>
                      <button
                        className="incident-id-button"
                        type="button"
                        onClick={() =>
                          navigate(`/incidents/${incident.id}`)
                        }
                      >
                        {incident.id}
                      </button>
                    </td>

                    <td>{incident.client}</td>
                    <td>{incident.worker}</td>
                    <td>{incident.type}</td>
                    <td>{incident.date}</td>

                    <td>
                      <span
                        className={`severity severity--${incident.severity.toLowerCase()}`}
                      >
                        <CircleAlert size={13} />
                        {incident.severity}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`incident-status incident-status--${incident.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {incident.status === "Closed" ? (
                          <CheckCircle2 size={13} />
                        ) : incident.status === "Action required" ? (
                          <TriangleAlert size={13} />
                        ) : (
                          <CircleAlert size={13} />
                        )}

                        {incident.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="incident-menu-button"
                        type="button"
                        onClick={() =>
                          navigate(`/incidents/${incident.id}`)
                        }
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <p>Showing 1–8 of 25 incidents</p>

            <div className="pagination">
              <button type="button">
                <ChevronLeft size={17} />
              </button>
              <button className="active" type="button">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">4</button>
              <button type="button">
                <ChevronRight size={17} />
              </button>
            </div>
          </footer>
        </section>
      </main>
    </AppLayout>
  );
}

export default Incidents;