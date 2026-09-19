import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  FileText,
  Plus,
  Send,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import "../styles/carerIncidents.css";

type IncidentStatus =
  | "Under review"
  | "Draft"
  | "Closed"
  | "Action required";

interface Incident {
  id: string;
  client: string;
  type: string;
  incidentDate: string;
  submittedDate: string;
  status: IncidentStatus;
}

const incidents: Incident[] = [
  {
    id: "INC-2025-0142",
    client: "Jordan Davis",
    type: "Fall",
    incidentDate: "24 Jul 2025",
    submittedDate: "24 Jul 2025",
    status: "Under review",
  },
  {
    id: "INC-2025-0141",
    client: "Margaret Lewis",
    type: "Behavioural",
    incidentDate: "18 Jul 2025",
    submittedDate: "—",
    status: "Draft",
  },
  {
    id: "INC-2025-0138",
    client: "Brian Chen",
    type: "Medication",
    incidentDate: "3 Jul 2025",
    submittedDate: "3 Jul 2025",
    status: "Closed",
  },
  {
    id: "INC-2025-0134",
    client: "Claire Campbell",
    type: "Environment",
    incidentDate: "25 Jun 2025",
    submittedDate: "25 Jun 2025",
    status: "Action required",
  },
  {
    id: "INC-2025-0130",
    client: "Aisha Taylor",
    type: "Client unwell",
    incidentDate: "10 Jun 2025",
    submittedDate: "10 Jun 2025",
    status: "Closed",
  },
  {
    id: "INC-2025-0125",
    client: "Jordan Davis",
    type: "Behavioural",
    incidentDate: "22 May 2025",
    submittedDate: "22 May 2025",
    status: "Closed",
  },
  {
    id: "INC-2025-0121",
    client: "Margaret Lewis",
    type: "Fall",
    incidentDate: "12 May 2025",
    submittedDate: "12 May 2025",
    status: "Closed",
  },
  {
    id: "INC-2025-0118",
    client: "Claire Campbell",
    type: "Medication",
    incidentDate: "2 May 2025",
    submittedDate: "—",
    status: "Draft",
  },
];

function IncidentStatusBadge({
  status,
}: {
  status: IncidentStatus;
}) {
  const className = status.toLowerCase().replaceAll(" ", "-");

  return (
    <span className={`myincident-status myincident-status--${className}`}>
      {status === "Closed" && <CheckCircle2 size={14} />}
      {status === "Draft" && <FileText size={14} />}
      {status === "Under review" && <Clock3 size={14} />}
      {status === "Action required" && <CircleAlert size={14} />}

      {status}
    </span>
  );
}

function CarerIncidents() {
  const navigate = useNavigate();

  return (
    <AppLayout >
      <main className="carer-page my-incidents-page">
        <section className="my-incidents-heading">
          <div>
            <h1>My incidents</h1>
            <p>
              View and manage the incidents you have reported.
            </p>
          </div>

          <button
            className="report-incident-button"
            type="button"
            onClick={() => navigate("/carer/incidents/report")}
          >
            <Plus size={18} />
            Report incident
          </button>
        </section>

        <section className="my-incident-stat-grid">
          <article className="my-incident-stat my-incident-stat--blue">
            <FileText size={26} />

            <div>
              <strong>2</strong>
              <span>Drafts</span>
              <small>Not yet submitted</small>
            </div>
          </article>

          <article className="my-incident-stat my-incident-stat--green">
            <Send size={26} />

            <div>
              <strong>5</strong>
              <span>Submitted</span>
              <small>Under review</small>
            </div>
          </article>

          <article className="my-incident-stat my-incident-stat--orange">
            <CircleAlert size={26} />

            <div>
              <strong>1</strong>
              <span>Action required</span>
              <small>Needs your attention</small>
            </div>
          </article>

          <article className="my-incident-stat my-incident-stat--green">
            <CheckCircle2 size={26} />

            <div>
              <strong>8</strong>
              <span>Closed</span>
              <small>No further action</small>
            </div>
          </article>
        </section>

        <section className="my-incidents-card">
          <div className="my-incident-filters">
            <label>
              <span>Status</span>

              <button type="button">
                All statuses
                <ChevronDown size={16} />
              </button>
            </label>

            <label>
              <span>Date range</span>

              <div className="incident-date-filter">
                <CalendarDays size={17} />

                <span>1 May 2025 – 31 Jul 2025</span>

                <button type="button" aria-label="Clear dates">
                  <X size={16} />
                </button>
              </div>
            </label>
          </div>

          <div className="table-wrapper">
            <table className="my-incidents-table">
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Incident date</th>
                  <th>Submitted date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>
                      <button
                        className="incident-number"
                        type="button"
                         onClick={() =>
                          navigate(`/incidents/${incident.id}`)
                        }
                      >
                        {incident.id}
                      </button>
                    </td>

                    <td>{incident.client}</td>
                    <td>{incident.type}</td>
                    <td>{incident.incidentDate}</td>
                    <td>{incident.submittedDate}</td>

                    <td>
                      <IncidentStatusBadge
                        status={incident.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="my-incidents-footer">
            Showing 8 of 8 incidents
          </footer>
        </section>
      </main>
    </AppLayout>
  );
}

export default CarerIncidents;