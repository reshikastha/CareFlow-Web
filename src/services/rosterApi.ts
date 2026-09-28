const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export type ShiftStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface RosterShift {
  id: number;
  clientId: number;
  careWorkerId: number | null;
  clientName: string;
  careWorkerName: string | null;
  location: string | null;
  shiftStart: string;
  shiftEnd: string;
  status: ShiftStatus;
  notes: string | null;
}

export interface CreateRosterShiftData {
  clientId: number;
  careWorkerId: number;
  shiftStart: string;
  shiftEnd: string;
  notes?: string;
}

// This describes the snake_case response from PostgreSQL.
interface RosterShiftApiResponse {
  id: number;
  shift_start: string;
  shift_end: string;
  status: ShiftStatus;
  notes: string | null;
  client_id: number;
  client_name: string;
  care_worker_id: number | null;
  care_worker_name: string | null;
  location?: string | null;
  client_address?: string | null;
}

interface GetRosterResponse {
  success: boolean;
  count: number;
  roster: RosterShiftApiResponse[];
}

function getToken(): string {
  return localStorage.getItem("careflow_token") ?? "";
}

// Convert snake_case backend data into camelCase frontend data.
function normaliseRosterShift(
  shift: RosterShiftApiResponse,
): RosterShift {
  return {
    id: shift.id,
    shiftStart: shift.shift_start,
    shiftEnd: shift.shift_end,
    status: shift.status,
    notes: shift.notes,

    clientId: shift.client_id,
    clientName: shift.client_name,

    careWorkerId: shift.care_worker_id,
    careWorkerName: shift.care_worker_name,

    location:
      shift.location ??
      shift.client_address ??
      "No location",
  };
}

async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? "Unable to complete the request.",
    );
  }

  return data;
}

// GET /api/roster
export async function getRoster(): Promise<RosterShift[]> {
  const response = await apiRequest<GetRosterResponse>(
    `${API_URL}/roster`,
  );

  // Convert every object before sending it to Roster.tsx.
  return (response.roster ?? []).map(normaliseRosterShift);
}

// POST /api/roster
export async function createRosterShift(
  shift: CreateRosterShiftData,
): Promise<RosterShift> {
  const response = await apiRequest<{
    success: boolean;
    message: string;
    shift: RosterShiftApiResponse;
  }>(`${API_URL}/roster`, {
    method: "POST",
    body: JSON.stringify(shift),
  });

  return normaliseRosterShift(response.shift);
}

// PATCH /api/roster/:shiftId/status
export async function updateShiftStatus(
  shiftId: number,
  status: ShiftStatus,
): Promise<RosterShift> {
  const response = await apiRequest<{
    success: boolean;
    message: string;
    shift: RosterShiftApiResponse;
  }>(`${API_URL}/roster/${shiftId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  return normaliseRosterShift(response.shift);
}