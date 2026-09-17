import {
  ChevronDown,
  CircleAlert,
  Clock3,
  FileText,
  MoreHorizontal,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import "../styles/incidentReview.css";

const timelineItems = [
  {
    time: "24 Jun 2025, 14:30",
    title: "Status changed to Under review",
    person: "Reshika (Admin)",
    color: "green",
  },
  {
    time: "24 Jun 2025, 12:15",
    title: "Follow-up task created",
    person: "Ben Lee",
    color: "dark",
  },
  {
    time: "24 Jun 2025, 11:00",
    title: "Information requested from worker",
    person: "Reshika (Admin)",
    color: "blue",
  },
  {
    time: "24 Jun 2025, 10:45",
    title: "Incident reported",
    person: "Aisha Khan",
    description:
      "Client slipped while transferring from bed to chair. No visible injury, but reported mild discomfort.",
    color: "dark",
  },
];

const followUpActions = [
  {
    task: "Review care plan and mobility support",
    assigned: "Ben Lee",
    dueDate: "26 Jun 2025",
    status: "Open",
  },
  {
    task: "Complete falls risk assessment",
    assigned: "Priya Sharma",
    dueDate: "27 Jun 2025",
    status: "In progress",
  },
  {
    task: "Follow up with client and family",
    assigned: "Aisha Khan",
    dueDate: "29 Jun 2025",
    status: "Not started",
  },
];

function IncidentReview() {
  const { incidentId } = useParams();

  return (
    <AppLayout>
      <main className="page-content incident-review-page">
        <div className="review-breadcrumb">
          <Link to="/incidents">Incidents</Link>
          <span>/</span>
          <span>{incidentId ?? "INC-024"}</span>
        </div>

        <section className="review-heading">
          <div>
            <h1>Incident review</h1>
            <p>
              Review details, track actions and ensure the incident
              is resolved.
            </p>
          </div>

          <div className="review-actions">
            <label className="review-status-select">
              <span>Status</span>

              <button type="button">
                <Clock3 size={16} />
                Under review
                <ChevronDown size={16} />
              </button>
            </label>

            <button className="request-button" type="button">
              Request information
            </button>

            <button className="green-button" type="button">
              Close incident
            </button>
          </div>
        </section>

        <section className="review-layout">
          <div className="review-main-column">
            <article className="review-card incident-details-card">
              <header>
                <h2>Incident details</h2>
                <button type="button">Edit</button>
              </header>

              <div className="incident-detail-grid">
                <div>
                  <span>Incident ID</span>
                  <strong>{incidentId ?? "INC-024"}</strong>
                </div>

                <div>
                  <span>Date and time</span>
                  <strong>Tue, 24 Jun 2025, 10:20</strong>
                </div>

                <div>
                  <span>Type</span>
                  <strong>Fall risk</strong>
                </div>

                <div>
                  <span>Client</span>
                  <Link to="/clients">Aisha Foster</Link>
                </div>

                <div>
                  <span>Worker</span>
                  <strong>Aisha Khan</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>Maple House</strong>
                </div>

                <div>
                  <span>Severity</span>
                  <strong className="review-severity">
                    <CircleAlert size={13} />
                    High
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong className="review-under-status">
                    <Clock3 size={13} />
                    Under review
                  </strong>
                </div>

                <div>
                  <span>Reported by</span>
                  <strong>Aisha Khan</strong>
                </div>
              </div>

              <div className="review-description">
                <section>
                  <h3>Description</h3>
                  <p>
                    Client slipped while transferring from bed to
                    chair. No visible injury, but reported mild
                    discomfort. Client remained alert and was
                    supported back to a safe position.
                  </p>
                </section>

                <section>
                  <h3>Immediate action taken</h3>
                  <p>
                    Assisted client to a safe position, assessed for
                    injury, provided reassurance and notified the
                    on-site nurse. Increased supervision for the
                    remainder of the shift.
                  </p>
                </section>

                <section>
                  <h3>People notified</h3>
                  <p>
                    On-site nurse, Team leader (Linden House),
                    Client’s family (as per care plan).
                  </p>
                </section>
              </div>

              <section className="attachments-section">
                <h3>Attachments</h3>

                <div className="attachments-grid">
                  <article className="attachment-card">
                    <FileText size={21} />

                    <div>
                      <strong>incident-report-INC-024.pdf</strong>
                      <span>245 KB</span>
                    </div>

                    <button type="button">
                      <MoreHorizontal size={17} />
                    </button>
                  </article>

                  <article className="attachment-card">
                    <FileText size={21} />

                    <div>
                      <strong>location-photo.pdf</strong>
                      <span>120 KB</span>
                    </div>

                    <button type="button">
                      <MoreHorizontal size={17} />
                    </button>
                  </article>
                </div>
              </section>
            </article>
          </div>

          <aside className="review-card timeline-card">
            <h2>Activity timeline</h2>

            <div className="timeline">
              {timelineItems.map((item) => (
                <article
                  className="timeline-item"
                  key={`${item.time}-${item.title}`}
                >
                  <span
                    className={`timeline-dot timeline-dot--${item.color}`}
                  />

                  <div>
                    <time>{item.time}</time>
                    <h3>{item.title}</h3>
                    <p>{item.person}</p>

                    {item.description && (
                      <p>{item.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <button className="activity-button" type="button">
              View all activity
            </button>
          </aside>
        </section>

        <section className="review-card follow-up-card">
          <h2>Follow-up actions</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assigned to</th>
                  <th>Due date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {followUpActions.map((action) => (
                  <tr key={action.task}>
                    <td>{action.task}</td>
                    <td>{action.assigned}</td>
                    <td>{action.dueDate}</td>

                    <td>
                      <span
                        className={`action-status action-status--${action.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {action.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="follow-up-menu"
                        type="button"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}

export default IncidentReview;