import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  MapPin,
  Save,
  ShieldAlert,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import AppLayout from "../components/AppLayout";

import {
  createIncident,
  getIncident,
  updateIncident,
  type IncidentFormData,
  type IncidentSeverity,
} from "../services/incidentApi";

import "../styles/incidentForm.css";

interface ClientOption {
  id: number;
  name: string;
}

interface WorkerOption {
  id: number;
  name: string;
}

const initialFormData: IncidentFormData = {
  clientId: 0,
  workerId: null,
  incidentType: "",
  occurredAt: "",
  location: "",
  severity: "LOW",
  description: "",
  immediateAction: "",
  peopleNotified: "",
};

const incidentTypes = [
  "Fall risk",
  "Medication",
  "Behavioural",
  "Client concern",
  "Missed visit",
  "Property damage",
  "Environmental",
  "Injury",
  "Manual handling",
  "Safeguarding concern",
  "Other",
];

function getToken(): string {
  const token = localStorage.getItem("careflow_token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return token;
}

// Convert a backend date into the format required by
// <input type="datetime-local" />.
function toDateTimeLocal(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// GET /api/clients
async function loadClientOptions(): Promise<ClientOption[]> {
  const response = await fetch(
    "http://localhost:5000/api/clients",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? "Unable to retrieve clients.",
    );
  }

  const clientItems = data.clients ?? data;

  if (!Array.isArray(clientItems)) {
    return [];
  }

  return clientItems.map((client) => ({
    id: Number(client.id),

    // Supports different backend column names.
    name:
      client.full_name ??
      client.client_name ??
      client.name ??
      `Client ${client.id}`,
  }));
}

// GET /api/workers
async function loadWorkerOptions(): Promise<WorkerOption[]> {
  const response = await fetch(
    "http://localhost:5000/api/workers",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? "Unable to retrieve workers.",
    );
  }

  const workerItems = data.workers ?? data;

  if (!Array.isArray(workerItems)) {
    return [];
  }

  return workerItems.map((worker) => ({
    id: Number(worker.id),

    name:
      worker.full_name ??
      worker.worker_name ??
      worker.name ??
      `Worker ${worker.id}`,
  }));
}

function IncidentForm() {
  const navigate = useNavigate();
  const { incidentId } = useParams();

  const numericIncidentId = incidentId
    ? Number(incidentId.replace(/^INC-/i, ""))
    : null;

  const isEditMode =
    numericIncidentId !== null &&
    Number.isInteger(numericIncidentId) &&
    numericIncidentId > 0;

  const [formData, setFormData] =
    useState<IncidentFormData>(initialFormData);

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [workers, setWorkers] = useState<WorkerOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load clients, workers and the existing incident when editing.
  const loadFormData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [clientOptions, workerOptions] =
        await Promise.all([
          loadClientOptions(),
          loadWorkerOptions(),
        ]);

      setClients(clientOptions);
      setWorkers(workerOptions);

      if (isEditMode && numericIncidentId) {
        const incident = await getIncident(numericIncidentId);

        setFormData({
          clientId: incident.clientId,
          workerId: incident.workerId,
          incidentType: incident.incidentType,
          occurredAt: toDateTimeLocal(
            incident.occurredAt,
          ),
          location: incident.location ?? "",
          severity: incident.severity,
          description: incident.description,
          immediateAction:
            incident.immediateAction ?? "",
          peopleNotified:
            incident.peopleNotified ?? "",
        });
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load the incident form.",
      );
    } finally {
      setLoading(false);
    }
  }, [isEditMode, numericIncidentId]);

  useEffect(() => {
    void loadFormData();
  }, [loadFormData]);

  function updateField<K extends keyof IncidentFormData>(
    field: K,
    value: IncidentFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string | null {
    if (!formData.clientId) {
      return "Please select a client.";
    }

    if (!formData.incidentType.trim()) {
      return "Please select an incident type.";
    }

    if (!formData.occurredAt) {
      return "Please enter the incident date and time.";
    }

    if (!formData.description.trim()) {
      return "Please enter an incident description.";
    }

    if (formData.description.trim().length < 10) {
      return "The incident description must contain at least 10 characters.";
    }

    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      // Convert local date/time into an ISO date for PostgreSQL.
      const requestData: IncidentFormData = {
        ...formData,
        occurredAt: new Date(
          formData.occurredAt,
        ).toISOString(),

        location: formData.location.trim(),
        description: formData.description.trim(),
        immediateAction:
          formData.immediateAction.trim(),
        peopleNotified:
          formData.peopleNotified.trim(),
      };

      if (isEditMode && numericIncidentId) {
        const updatedIncident = await updateIncident(
          numericIncidentId,
          requestData,
        );

        setMessage("Incident updated successfully.");

        // Open the updated incident review page.
        navigate(`/incidents/${updatedIncident.id}`);
      } else {
        const createdIncident = await createIncident(
          requestData,
        );

        setMessage("Incident created successfully.");

        // Open the new incident review page.
        navigate(`/incidents/${createdIncident.id}`);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : isEditMode
            ? "Unable to update incident."
            : "Unable to create incident.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <main className="page-content incident-form-page">
          <div className="incident-form-loading">
            Loading incident form...
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="page-content incident-form-page">
        <section className="incident-form-heading">
          <div>
            <button
              className="incident-back-button"
              type="button"
              onClick={() => navigate("/incidents")}
            >
              <ArrowLeft size={18} />
              Back to incidents
            </button>

            <h1>
              {isEditMode
                ? "Edit incident"
                : "Report new incident"}
            </h1>

            <p>
              {isEditMode
                ? "Update the incident information and actions taken."
                : "Record all relevant information about the incident."}
            </p>
          </div>

          <div className="incident-form-heading-icon">
            <ShieldAlert size={30} />
          </div>
        </section>

        {error && (
          <div className="incident-form-error">
            <CircleAlert size={19} />
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
          <div className="incident-form-success">
            <CheckCircle2 size={19} />
            <span>{message}</span>
          </div>
        )}

        <form
          className="incident-form"
          onSubmit={handleSubmit}
        >
          <section className="incident-form-card">
            <header className="incident-form-card-header">
              <div className="form-section-icon">
                <UsersRound size={20} />
              </div>

              <div>
                <h2>People involved</h2>
                <p>
                  Select the client and care worker involved.
                </p>
              </div>
            </header>

            <div className="incident-form-grid">
              <label className="incident-field">
                <span>
                  Client <em>*</em>
                </span>

                <select
                  value={formData.clientId}
                  onChange={(event) =>
                    updateField(
                      "clientId",
                      Number(event.target.value),
                    )
                  }
                  required
                >
                  <option value={0}>
                    Select a client
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="incident-field">
                <span>Care worker involved</span>

                <select
                  value={formData.workerId ?? ""}
                  onChange={(event) =>
                    updateField(
                      "workerId",
                      event.target.value
                        ? Number(event.target.value)
                        : null,
                    )
                  }
                >
                  <option value="">
                    No worker selected
                  </option>

                  {workers.map((worker) => (
                    <option
                      key={worker.id}
                      value={worker.id}
                    >
                      {worker.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="incident-form-card">
            <header className="incident-form-card-header">
              <div className="form-section-icon">
                <ClipboardList size={20} />
              </div>

              <div>
                <h2>Incident information</h2>
                <p>
                  Enter when, where and what happened.
                </p>
              </div>
            </header>

            <div className="incident-form-grid">
              <label className="incident-field">
                <span>
                  Incident type <em>*</em>
                </span>

                <select
                  value={formData.incidentType}
                  onChange={(event) =>
                    updateField(
                      "incidentType",
                      event.target.value,
                    )
                  }
                  required
                >
                  <option value="">
                    Select incident type
                  </option>

                  {incidentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="incident-field">
                <span>
                  Date and time <em>*</em>
                </span>

                <div className="incident-input-icon">
                  <CalendarDays size={18} />

                  <input
                    type="datetime-local"
                    value={formData.occurredAt}
                    onChange={(event) =>
                      updateField(
                        "occurredAt",
                        event.target.value,
                      )
                    }
                    required
                  />
                </div>
              </label>

              <label className="incident-field">
                <span>
                  Severity <em>*</em>
                </span>

                <select
                  value={formData.severity}
                  onChange={(event) =>
                    updateField(
                      "severity",
                      event.target
                        .value as IncidentSeverity,
                    )
                  }
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">
                    Critical
                  </option>
                </select>
              </label>

              <label className="incident-field">
                <span>Location</span>

                <div className="incident-input-icon">
                  <MapPin size={18} />

                  <input
                    type="text"
                    value={formData.location}
                    placeholder="For example, Maple House"
                    onChange={(event) =>
                      updateField(
                        "location",
                        event.target.value,
                      )
                    }
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="incident-form-card">
            <header className="incident-form-card-header">
              <div className="form-section-icon">
                <CircleAlert size={20} />
              </div>

              <div>
                <h2>Incident details</h2>
                <p>
                  Provide a clear and factual description.
                </p>
              </div>
            </header>

            <div className="incident-form-textareas">
              <label className="incident-field">
                <span>
                  Description <em>*</em>
                </span>

                <textarea
                  rows={6}
                  value={formData.description}
                  placeholder="Describe what happened, who was present and any injury or concern observed."
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  required
                />

                <small>
                  {formData.description.length} characters
                </small>
              </label>

              <label className="incident-field">
                <span>Immediate action taken</span>

                <textarea
                  rows={4}
                  value={formData.immediateAction}
                  placeholder="Describe assistance provided, observations completed or medical support requested."
                  onChange={(event) =>
                    updateField(
                      "immediateAction",
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="incident-field">
                <span>People notified</span>

                <textarea
                  rows={3}
                  value={formData.peopleNotified}
                  placeholder="For example: registered nurse, team leader and client family."
                  onChange={(event) =>
                    updateField(
                      "peopleNotified",
                      event.target.value,
                    )
                  }
                />
              </label>
            </div>
          </section>

          <section className="incident-form-notice">
            <UserRound size={21} />

            <div>
              <strong>Reporter information</strong>

              <p>
                The logged-in user will automatically be
                recorded as the person who reported this
                incident.
              </p>
            </div>
          </section>

          <footer className="incident-form-actions">
            <button
              className="incident-cancel-button"
              type="button"
              disabled={saving}
              onClick={() => navigate("/incidents")}
            >
              Cancel
            </button>

            <button
              className="green-button"
              type="submit"
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? isEditMode
                  ? "Saving changes..."
                  : "Creating incident..."
                : isEditMode
                  ? "Save changes"
                  : "Create incident"}
            </button>
          </footer>
        </form>
      </main>
    </AppLayout>
  );
}

export default IncidentForm;