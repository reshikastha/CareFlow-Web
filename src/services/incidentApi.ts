const API_URL = "http://localhost:5000/api/incidents";

export type IncidentSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type IncidentStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "ACTION_REQUIRED"
  | "CLOSED";

export interface Incident {
  id: number;
  incidentNumber: string;
  clientId: number;
  clientName: string;
  workerId: number | null;
  workerName: string | null;
  reportedById: number;
  reportedByName: string;
  incidentType: string;
  occurredAt: string;
  location: string | null;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  immediateAction: string | null;
  peopleNotified: string | null;
  resolutionNotes: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentActivity {
  id: number;
  incidentId: number;
  action: string;
  details: string | null;
  performedById: number;
  performedByName: string;
  createdAt: string;
}

interface ApiIncident {
  id: number;
  incident_number?: string;
  client_id: number;
  client_name: string;
  worker_id: number | null;
  worker_name: string | null;
  reported_by_id: number;
  reported_by_name: string;
  incident_type: string;
  occurred_at: string;
  location: string | null;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  immediate_action: string | null;
  people_notified: string | null;
  resolution_notes: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiActivity {
  id: number;
  incident_id: number;
  action: string;
  details: string | null;
  performed_by_id: number;
  performed_by_name: string;
  created_at: string;
}

export interface IncidentFormData {
  clientId: number;
  workerId: number | null;
  incidentType: string;
  occurredAt: string;
  location: string;
  severity: IncidentSeverity;
  description: string;
  immediateAction: string;
  peopleNotified: string;
}

// Read the JWT created when the user logged in.
function getToken(): string {
  const token = localStorage.getItem("careflow_token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return token;
}

// Convert backend snake_case fields into frontend camelCase fields.
function normalizeIncident(item: ApiIncident): Incident {
  return {
    id: item.id,
    incidentNumber:
      item.incident_number ?? `INC-${String(item.id).padStart(3, "0")}`,
    clientId: item.client_id,
    clientName: item.client_name,
    workerId: item.worker_id,
    workerName: item.worker_name,
    reportedById: item.reported_by_id,
    reportedByName: item.reported_by_name,
    incidentType: item.incident_type,
    occurredAt: item.occurred_at,
    location: item.location,
    severity: item.severity,
    status: item.status,
    description: item.description,
    immediateAction: item.immediate_action,
    peopleNotified: item.people_notified,
    resolutionNotes: item.resolution_notes,
    closedAt: item.closed_at,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function normalizeActivity(item: ApiActivity): IncidentActivity {
  return {
    id: item.id,
    incidentId: item.incident_id,
    action: item.action,
    details: item.details,
    performedById: item.performed_by_id,
    performedByName: item.performed_by_name,
    createdAt: item.created_at,
  };
}

// Handle normal Express JSON error responses.
async function handleResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? `Request failed with status ${response.status}.`,
    );
  }

  return data;
}


export async function getIncidents(): Promise<{
  incidents: Incident[];
  count: number;
}> {
  const token = localStorage.getItem("careflow_token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(
    "http://localhost:5000/api/incidents",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Unable to retrieve incidents.",
    );
  }

  const incidentItems = data.incidents ?? data;

  return {
    incidents: Array.isArray(incidentItems)
      ? incidentItems.map((item) => ({
          id: item.id,
          incidentNumber:
            item.incident_number ??
            `INC-${String(item.id).padStart(3, "0")}`,

          clientId: item.client_id,
          clientName: item.client_name,

          workerId: item.worker_id,
          workerName: item.worker_name,

          reportedById: item.reported_by_id,
          reportedByName: item.reported_by_name,

          incidentType: item.incident_type,
          occurredAt: item.occurred_at,
          location: item.location,

          severity: item.severity,
          status: item.status,

          description: item.description,
          immediateAction: item.immediate_action,
          peopleNotified: item.people_notified,
          resolutionNotes: item.resolution_notes,

          closedAt: item.closed_at,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      : [],

    count: data.count ?? incidentItems.length ?? 0,
  };
}

// GET /api/incidents/:incidentId
export async function getIncident(
  incidentId: number,
): Promise<Incident> {
  const response = await fetch(`${API_URL}/${incidentId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await handleResponse(response);

  // Supports either { incident: {...} } or a direct incident object.
  return normalizeIncident(data.incident ?? data);
}

// GET /api/incidents/:incidentId/activities
export async function getIncidentActivities(
  incidentId: number,
): Promise<IncidentActivity[]> {
  const response = await fetch(
    `${API_URL}/${incidentId}/activities`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  const data = await handleResponse(response);
  const activities = data.activities ?? data;

  return Array.isArray(activities)
    ? activities.map(normalizeActivity)
    : [];
}

// PATCH /api/incidents/:incidentId/status
export async function updateIncidentStatus(
  incidentId: number,
  status: IncidentStatus,
  resolutionNotes?: string,
): Promise<Incident> {
  const response = await fetch(
    `${API_URL}/${incidentId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        status,
        resolutionNotes,
      }),
    },
  );

  const data = await handleResponse(response);

  return normalizeIncident(data.incident ?? data);
}

// DELETE /api/incidents/:incidentId
export async function deleteIncident(
  incidentId: number,
): Promise<void> {
  const response = await fetch(`${API_URL}/${incidentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  await handleResponse(response);
}

// POST /api/incidents
export async function createIncident(
  formData: IncidentFormData,
): Promise<Incident> {
  const token = localStorage.getItem("careflow_token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(
    "http://localhost:5000/api/incidents",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(formData),
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? "Unable to create incident.",
    );
  }

  return normalizeIncident(data.incident ?? data);
}

// PATCH /api/incidents/:incidentId
export async function updateIncident(
  incidentId: number,
  formData: IncidentFormData,
): Promise<Incident> {
  const token = localStorage.getItem("careflow_token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(
    `http://localhost:5000/api/incidents/${incidentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(formData),
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? "Unable to update incident.",
    );
  }

  return normalizeIncident(data.incident ?? data);
}