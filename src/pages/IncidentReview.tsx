import {
  ChevronDown,
  CircleAlert,
  Clock3,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import AppLayout from "../components/AppLayout";

import {
  getIncident,
  getIncidentActivities,
  updateIncidentStatus,
  type Incident,
  type IncidentActivity,
  type IncidentStatus,
} from "../services/incidentApi";

import "../styles/incidentReview.css";

const statusLabels: Record<IncidentStatus, string> = {
  OPEN: "Open",
  UNDER_REVIEW: "Under review",
  ACTION_REQUIRED: "Action required",
  CLOSED: "Closed",
};

const severityLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Adelaide",
  }).format(new Date(dateValue));
}

// Supports route values such as "24" and "INC-024".
function getNumericIncidentId(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const cleanedValue = value.replace(/^INC-/i, "");
  const numericId = Number(cleanedValue);

  return Number.isInteger(numericId) && numericId > 0
    ? numericId
    : null;
}

function IncidentReview() {
  const { incidentId } = useParams();
  const navigate = useNavigate();

  const numericIncidentId = getNumericIncidentId(incidentId);

  const [incident, setIncident] = useState<Incident | null>(null);
  const [activities, setActivities] = useState<
    IncidentActivity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load the incident and its activity history.
  const loadIncident = useCallback(async () => {
    if (!numericIncidentId) {
      setError("Invalid incident ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Fetch both requests together.
      const [incidentData, activityData] = await Promise.all([
        getIncident(numericIncidentId),
        getIncidentActivities(numericIncidentId),
      ]);

      setIncident(incidentData);
      setActivities(activityData);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load incident.",
      );
    } finally {
      setLoading(false);
    }
  }, [numericIncidentId]);

  useEffect(() => {
    void loadIncident();
  }, [loadIncident]);

  // Change the incident status.
  async function handleStatusChange(status: IncidentStatus) {
    if (!incident) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");
      setMessage("");
      setShowStatusMenu(false);

      let resolutionNotes: string | undefined;

      // Ask for closing notes when the admin closes an incident.
      if (status === "CLOSED") {
        const notes = window.prompt(
          "Enter resolution notes before closing this incident:",
          incident.resolutionNotes ?? "",
        );

        // The user pressed Cancel.
        if (notes === null) {
          return;
        }

        if (!notes.trim()) {
          setError(
            "Resolution notes are required when closing an incident.",
          );
          return;
        }

        resolutionNotes = notes.trim();
      }

      const updatedIncident = await updateIncidentStatus(
        incident.id,
        status,
        resolutionNotes,
      );

      setIncident(updatedIncident);
      setMessage(
        `Incident status changed to ${statusLabels[status]}.`,
      );

      // Reload activity so the new status activity appears.
      const updatedActivities = await getIncidentActivities(
        incident.id,
      );

      setActivities(updatedActivities);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update incident status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  function handleRequestInformation() {
    void handleStatusChange("ACTION_REQUIRED");
  }

  if (loading) {
    return (
      <AppLayout>
        <main className="page-content incident-review-page">
          <p>Loading incident...</p>
        </main>
      </AppLayout>
    );
  }

  if (!incident) {
    return (
      <AppLayout>
        <main className="page-content incident-review-page">
          <div className="review-breadcrumb">
            <Link to="/incidents">Incidents</Link>
          </div>

          <p className="error-message">
            {error || "Incident was not found."}
          </p>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="page-content incident-review-page">
        <div className="review-breadcrumb">
          <Link to="/incidents">Incidents</Link>
          <span>/</span>
          <span>{incident.incidentNumber}</span>
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <section className="review-heading">
          <div>
            <h1>Incident review</h1>

            <p>
              Review details, track actions and ensure the incident
              is resolved.
            </p>
          </div>

          <div className="review-actions">
            <div className="review-status-select">
              <span>Status</span>

              <button
                type="button"
                disabled={updatingStatus}
                onClick={() =>
                  setShowStatusMenu((current) => !current)
                }
              >
                <Clock3 size={16} />
                {updatingStatus
                  ? "Updating..."
                  : statusLabels[incident.status]}
                <ChevronDown size={16} />
              </button>

              {showStatusMenu && (
                <div className="review-status-menu">
                  {(
                    Object.keys(
                      statusLabels,
                    ) as IncidentStatus[]
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={
                        incident.status === status
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        void handleStatusChange(status)
                      }
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="request-button"
              type="button"
              disabled={updatingStatus}
              onClick={handleRequestInformation}
            >
              Request information
            </button>

            <button
              className="green-button"
              type="button"
              disabled={
                updatingStatus || incident.status === "CLOSED"
              }
              onClick={() => void handleStatusChange("CLOSED")}
            >
              {incident.status === "CLOSED"
                ? "Incident closed"
                : "Close incident"}
            </button>
          </div>
        </section>

        <section className="review-layout">
          <div className="review-main-column">
            <article className="review-card incident-details-card">
              <header>
                <h2>Incident details</h2>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/incidents/${incident.id}/edit`,
                    )
                  }
                >
                  Edit
                </button>
              </header>

              <div className="incident-detail-grid">
                <div>
                  <span>Incident ID</span>
                  <strong>{incident.incidentNumber}</strong>
                </div>

                <div>
                  <span>Date and time</span>
                  <strong>
                    {formatDate(incident.occurredAt)}
                  </strong>
                </div>

                <div>
                  <span>Type</span>
                  <strong>{incident.incidentType}</strong>
                </div>

                <div>
                  <span>Client</span>
                  <Link to={`/clients/${incident.clientId}`}>
                    {incident.clientName}
                  </Link>
                </div>

                <div>
                  <span>Worker</span>
                  <strong>
                    {incident.workerName ?? "Not assigned"}
                  </strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>
                    {incident.location ?? "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>Severity</span>

                  <strong
                    className={`review-severity review-severity--${incident.severity.toLowerCase()}`}
                  >
                    <CircleAlert size={13} />
                    {severityLabels[incident.severity]}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong
                    className={`review-status review-status--${incident.status
                      .toLowerCase()
                      .replaceAll("_", "-")}`}
                  >
                    <Clock3 size={13} />
                    {statusLabels[incident.status]}
                  </strong>
                </div>

                <div>
                  <span>Reported by</span>
                  <strong>{incident.reportedByName}</strong>
                </div>
              </div>

              <div className="review-description">
                <section>
                  <h3>Description</h3>
                  <p>{incident.description}</p>
                </section>

                <section>
                  <h3>Immediate action taken</h3>
                  <p>
                    {incident.immediateAction ||
                      "No immediate action was recorded."}
                  </p>
                </section>

                <section>
                  <h3>People notified</h3>
                  <p>
                    {incident.peopleNotified ||
                      "No people were recorded as notified."}
                  </p>
                </section>

                {incident.resolutionNotes && (
                  <section>
                    <h3>Resolution notes</h3>
                    <p>{incident.resolutionNotes}</p>
                  </section>
                )}
              </div>
            </article>
          </div>

          <aside className="review-card timeline-card">
            <h2>Activity timeline</h2>

            <div className="timeline">
              {activities.length === 0 ? (
                <p>No activity has been recorded yet.</p>
              ) : (
                activities.map((activity, index) => (
                  <article
                    className="timeline-item"
                    key={activity.id}
                  >
                    <span
                      className={`timeline-dot ${
                        index === 0
                          ? "timeline-dot--green"
                          : "timeline-dot--dark"
                      }`}
                    />

                    <div>
                      <time>
                        {formatDate(activity.createdAt)}
                      </time>

                      <h3>{activity.action}</h3>
                      <p>{activity.performedByName}</p>

                      {activity.details && (
                        <p>{activity.details}</p>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </aside>
        </section>

        <section className="review-card follow-up-card">
          <h2>Follow-up actions</h2>

          <p>
            Follow-up action endpoints have not been added yet.
            This section can be connected after creating a
            follow-up actions table and API.
          </p>
        </section>
      </main>
    </AppLayout>
  );
}

export default IncidentReview;