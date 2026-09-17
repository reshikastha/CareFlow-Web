import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileWarning,
  Filter,
  MoreHorizontal,
  Plus,
  UserCheck,
  UsersRound,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import "../styles/workers.css";

type Availability =
  | "Available"
  | "On shift"
  | "Unavailable";

type Compliance =
  | "Compliant"
  | "Expiring soon";

interface Worker {
  initials: string;
  name: string;
  role: string;
  availability: Availability;
  hours: string;
  compliance: Compliance;
}

const workers: Worker[] = [
  {
    initials: "AK",
    name: "Aisha Khan",
    role: "Support Worker",
    availability: "Available",
    hours: "32h",
    compliance: "Compliant",
  },
  {
    initials: "BL",
    name: "Ben Lee",
    role: "Registered Nurse",
    availability: "On shift",
    hours: "38h",
    compliance: "Compliant",
  },
  {
    initials: "CT",
    name: "Chris Taylor",
    role: "Support Worker",
    availability: "Available",
    hours: "28h",
    compliance: "Compliant",
  },
  {
    initials: "DK",
    name: "Daniel Kim",
    role: "Support Worker",
    availability: "On shift",
    hours: "36h",
    compliance: "Expiring soon",
  },
  {
    initials: "EM",
    name: "Eleanor Mills",
    role: "Enrolled Nurse",
    availability: "Unavailable",
    hours: "20h",
    compliance: "Compliant",
  },
  {
    initials: "JC",
    name: "James Carter",
    role: "Support Worker",
    availability: "Available",
    hours: "24h",
    compliance: "Compliant",
  },
  {
    initials: "ML",
    name: "Margaret Lewis",
    role: "Support Worker",
    availability: "On shift",
    hours: "40h",
    compliance: "Expiring soon",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    role: "Support Worker",
    availability: "Available",
    hours: "30h",
    compliance: "Compliant",
  },
];

function Workers() {
  return (
    <AppLayout>
      <main className="page-content workers-page">
        <section className="workers-heading">
          <div>
            <h1>Workers</h1>
            <p>
              Manage your care team, availability and compliance.
            </p>
          </div>

          <button className="green-button" type="button">
            <Plus size={18} />
            Add worker
          </button>
        </section>

        <section className="worker-stat-grid">
          <article className="worker-stat worker-stat--green">
            <div className="worker-stat__icon">
              <UsersRound size={26} />
            </div>

            <div>
              <h2>Total workers</h2>
              <strong>28</strong>
              <p>+4 this month</p>
            </div>
          </article>

          <article className="worker-stat worker-stat--blue">
            <div className="worker-stat__icon">
              <UserCheck size={26} />
            </div>

            <div>
              <h2>Available today</h2>
              <strong>18</strong>
              <p>64% of team</p>
            </div>
          </article>

          <article className="worker-stat worker-stat--orange">
            <div className="worker-stat__icon">
              <FileWarning size={26} />
            </div>

            <div>
              <h2>Certificates expiring</h2>
              <strong>3</strong>
              <p>In next 30 days</p>
            </div>
          </article>
        </section>

        <section className="worker-table-card">
          <div className="worker-filters">
            <div className="worker-tabs">
              <button className="active" type="button">
                All workers (28)
              </button>

              <button type="button">Available (18)</button>
              <button type="button">On shift (6)</button>
              <button type="button">Unavailable (4)</button>
            </div>

            <button className="worker-filter-button" type="button">
              <Filter size={18} />
              Filter
            </button>
          </div>

          <div className="table-wrapper">
            <table className="workers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Availability</th>
                  <th>Hours this week</th>
                  <th>Compliance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {workers.map((worker) => (
                  <tr key={worker.name}>
                    <td>
                      <div className="worker-name">
                        <span className="worker-avatar">
                          {worker.initials}
                        </span>

                        <strong>{worker.name}</strong>
                      </div>
                    </td>

                    <td>{worker.role}</td>

                    <td>
                      <span
                        className={`availability availability--${worker.availability
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {worker.availability}
                      </span>
                    </td>

                    <td>{worker.hours}</td>

                    <td>
                      <span
                        className={`compliance compliance--${worker.compliance
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {worker.compliance === "Compliant" ? (
                          <BadgeCheck size={16} />
                        ) : (
                          <CircleAlert size={16} />
                        )}

                        {worker.compliance}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-menu-button"
                        type="button"
                        aria-label={`Actions for ${worker.name}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <p>Showing 1–8 of 28 workers</p>

            <div className="pagination">
              <button type="button" aria-label="Previous page">
                <ChevronLeft size={17} />
              </button>

              <button className="active" type="button">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">4</button>

              <button type="button" aria-label="Next page">
                <ChevronRight size={17} />
              </button>
            </div>
          </footer>
        </section>
      </main>
    </AppLayout>
  );
}

export default Workers;