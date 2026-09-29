import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleDot,
  Filter,
  MoreHorizontal,
  Plus,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import AppLayout from "../components/AppLayout";

import {
  deleteIncident,
  getIncidents,
  type Incident,
  type IncidentSeverity,
  type IncidentStatus,
} from "../services/incidentApi";

import "../styles/incidents.css";

const ITEMS_PER_PAGE = 8;

const statusLabels: Record<IncidentStatus, string> = {
  OPEN: "Open",
  UNDER_REVIEW: "Under review",
  ACTION_REQUIRED: "Action required",
  CLOSED: "Closed",
};

const severityLabels: Record<IncidentSeverity, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Australia/Adelaide",
  }).format(new Date(dateValue));
}

function Incidents() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(
    null,
  );

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(
    null,
  );

  const [statusFilter, setStatusFilter] = useState<
    IncidentStatus | "ALL"
  >("ALL");

  const [severityFilter, setSeverityFilter] = useState<
    IncidentSeverity | "ALL"
  >("ALL");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Load all incidents from the backend.
  const loadIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getIncidents();

      setIncidents(result.incidents);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to retrieve incidents.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadIncidents();
  }, [loadIncidents]);

  // Apply filters to the loaded incidents.
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      if (
        statusFilter !== "ALL" &&
        incident.status !== statusFilter
      ) {
        return false;
      }

      if (
        severityFilter !== "ALL" &&
        incident.severity !== severityFilter
      ) {
        return false;
      }

      const incidentDate = new Date(incident.occurredAt);

      if (startDate) {
        const selectedStartDate = new Date(`${startDate}T00:00:00`);

        if (incidentDate < selectedStartDate) {
          return false;
        }
      }

      if (endDate) {
        const selectedEndDate = new Date(`${endDate}T23:59:59`);

        if (incidentDate > selectedEndDate) {
          return false;
        }
      }

      return true;
    });
  }, [
    incidents,
    statusFilter,
    severityFilter,
    startDate,
    endDate,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredIncidents.length / ITEMS_PER_PAGE),
  );

  const paginatedIncidents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredIncidents.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredIncidents, currentPage]);

  // Return to page one whenever filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, severityFilter, startDate, endDate]);

  // Calculate dashboard statistics from all incidents.
  const statistics = useMemo(() => {
    return {
      open: incidents.filter(
        (incident) => incident.status === "OPEN",
      ).length,

      underReview: incidents.filter(
        (incident) => incident.status === "UNDER_REVIEW",
      ).length,

      actionRequired: incidents.filter(
        (incident) => incident.status === "ACTION_REQUIRED",
      ).length,

      closed: incidents.filter(
        (incident) => incident.status === "CLOSED",
      ).length,
    };
  }, [incidents]);

  function clearFilters() {
    setStatusFilter("ALL");
    setSeverityFilter("ALL");
    setStartDate("");
    setEndDate("");
    setShowFilters(false);
  }

  async function handleDelete(incident: Incident) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${incident.incidentNumber}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(incident.id);
      setOpenMenuId(null);
      setError("");
      setMessage("");

      await deleteIncident(incident.id);

      setIncidents((currentIncidents) =>
        currentIncidents.filter(
          (currentIncident) =>
            currentIncident.id !== incident.id,
        ),
      );

      setMessage(
        `${incident.incidentNumber} was deleted successfully.`,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete incident.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const firstVisibleItem =
    filteredIncidents.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const lastVisibleItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredIncidents.length,
  );

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

          <button
            className="green-button"
            type="button"
            onClick={() => navigate("/incidents/new")}
          >
            <Plus size={18} />
            New incident
          </button>
        </section>

        {error && (
          <div className="incident-error-message">
            <CircleAlert size={18} />
            <span>{error}</span>

            <button
              type="button"
              aria-label="Close error"
              onClick={() => setError("")}
            >
              <X size={17} />
            </button>
          </div>
        )}

        {message && (
          <div className="incident-success-message">
            <CheckCircle2 size={18} />
            <span>{message}</span>

            <button
              type="button"
              aria-label="Close message"
              onClick={() => setMessage("")}
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="incident-stat-grid">
          <article className="incident-stat incident-stat--red">
            <CircleAlert size={30} />

            <div>
              <h2>Open</h2>
              <strong>{statistics.open}</strong>
              <p>Needs review</p>
            </div>
          </article>

          <article className="incident-stat incident-stat--orange">
            <CircleDot size={30} />

            <div>
              <h2>Under review</h2>
              <strong>{statistics.underReview}</strong>
              <p>In progress</p>
            </div>
          </article>

          <article className="incident-stat incident-stat--red">
            <TriangleAlert size={30} />

            <div>
              <h2>Action required</h2>
              <strong>{statistics.actionRequired}</strong>
              <p>Needs attention</p>
            </div>
          </article>

          <article className="incident-stat incident-stat--green">
            <CheckCircle2 size={30} />

            <div>
              <h2>Closed</h2>
              <strong>{statistics.closed}</strong>
              <p>Total closed</p>
            </div>
          </article>
        </section>

        <section className="incident-table-card">
          <div className="incident-filters">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
            >
              <CalendarDays size={18} />

              {startDate || endDate
                ? `${startDate || "Any date"} – ${
                    endDate || "Any date"
                  }`
                : "All dates"}

              <ChevronDown size={16} />
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
            >
              <TriangleAlert size={18} />

              {severityFilter === "ALL"
                ? "All severities"
                : severityLabels[severityFilter]}

              <ChevronDown size={16} />
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
            >
              <CircleDot size={18} />

              {statusFilter === "ALL"
                ? "All statuses"
                : statusLabels[statusFilter]}

              <ChevronDown size={16} />
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
            >
              <Filter size={18} />
              Filter
            </button>
          </div>

          {loading ? (
            <div className="incident-loading">
              Loading incidents...
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="incidents-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Select all incidents"
                      />
                    </th>

                    <th>ID</th>
                    <th>Client</th>
                    <th>Worker</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedIncidents.length === 0 ? (
                    <tr>
                      <td
                        className="incident-empty-row"
                        colSpan={9}
                      >
                        No incidents match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedIncidents.map((incident) => (
                      <tr key={incident.id}>
                        <td>
                          <input
                            type="checkbox"
                            aria-label={`Select ${incident.incidentNumber}`}
                          />
                        </td>

                        <td>
                          <button
                            className="incident-id-button"
                            type="button"
                            onClick={() =>
                              navigate(
                                `/incidents/${incident.id}`,
                              )
                            }
                          >
                            {incident.incidentNumber}
                          </button>
                        </td>

                        <td>{incident.clientName}</td>

                        <td>
                          {incident.workerName ?? "Not assigned"}
                        </td>

                        <td>{incident.incidentType}</td>

                        <td>
                          {formatDate(incident.occurredAt)}
                        </td>

                        <td>
                          <span
                            className={`severity severity--${incident.severity.toLowerCase()}`}
                          >
                            <CircleAlert size={13} />
                            {severityLabels[incident.severity]}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`incident-status incident-status--${incident.status
                              .toLowerCase()
                              .replaceAll("_", "-")}`}
                          >
                            {incident.status === "CLOSED" ? (
                              <CheckCircle2 size={13} />
                            ) : incident.status ===
                              "ACTION_REQUIRED" ? (
                              <TriangleAlert size={13} />
                            ) : (
                              <CircleAlert size={13} />
                            )}

                            {statusLabels[incident.status]}
                          </span>
                        </td>

                        <td className="incident-action-cell">
                          <button
                            className="incident-menu-button"
                            type="button"
                            aria-label={`Actions for ${incident.incidentNumber}`}
                            onClick={() =>
                              setOpenMenuId((currentId) =>
                                currentId === incident.id
                                  ? null
                                  : incident.id,
                              )
                            }
                          >
                            <MoreHorizontal size={17} />
                          </button>

                          {openMenuId === incident.id && (
                            <div className="incident-action-menu">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/incidents/${incident.id}`,
                                  )
                                }
                              >
                                View incident
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/incidents/${incident.id}/edit`,
                                  )
                                }
                              >
                                Edit incident
                              </button>

                              <button
                                className="delete-action"
                                type="button"
                                disabled={
                                  deletingId === incident.id
                                }
                                onClick={() =>
                                  void handleDelete(incident)
                                }
                              >
                                {deletingId === incident.id
                                  ? "Deleting..."
                                  : "Delete incident"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <footer className="table-footer">
            <p>
              Showing {firstVisibleItem}–{lastVisibleItem} of{" "}
              {filteredIncidents.length} incidents
            </p>

            <div className="pagination">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1),
                  )
                }
              >
                <ChevronLeft size={17} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1,
              ).map((page) => (
                <button
                  key={page}
                  className={
                    currentPage === page ? "active" : ""
                  }
                  type="button"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1),
                  )
                }
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </footer>
        </section>

        {showFilters && (
          <div
            className="incident-modal-overlay"
            role="presentation"
            onMouseDown={() => setShowFilters(false)}
          >
            <section
              className="incident-filter-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="incident-filter-title"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <header>
                <div>
                  <h2 id="incident-filter-title">
                    Filter incidents
                  </h2>

                  <p>
                    Choose dates, severity and incident status.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setShowFilters(false)}
                >
                  <X size={19} />
                </button>
              </header>

              <div className="incident-filter-fields">
                <label>
                  Start date

                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) =>
                      setStartDate(event.target.value)
                    }
                  />
                </label>

                <label>
                  End date

                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(event) =>
                      setEndDate(event.target.value)
                    }
                  />
                </label>

                <label>
                  Severity

                  <select
                    value={severityFilter}
                    onChange={(event) =>
                      setSeverityFilter(
                        event.target.value as
                          | IncidentSeverity
                          | "ALL",
                      )
                    }
                  >
                    <option value="ALL">
                      All severities
                    </option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">
                      Critical
                    </option>
                  </select>
                </label>

                <label>
                  Status

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as
                          | IncidentStatus
                          | "ALL",
                      )
                    }
                  >
                    <option value="ALL">
                      All statuses
                    </option>
                    <option value="OPEN">Open</option>
                    <option value="UNDER_REVIEW">
                      Under review
                    </option>
                    <option value="ACTION_REQUIRED">
                      Action required
                    </option>
                    <option value="CLOSED">
                      Closed
                    </option>
                  </select>
                </label>
              </div>

              <div className="incident-filter-actions">
                <button
                  className="outline-button"
                  type="button"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>

                <button
                  className="green-button"
                  type="button"
                  onClick={() => setShowFilters(false)}
                >
                  Apply filters
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </AppLayout>
  );
}

export default Incidents;