const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export type ClientStatus = "Active" | "Inactive";

export type SupportType =
  | "Home care"
  | "NDIS"
  | "Respite";

export interface Client {
  id: number;
  fullName: string;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  suburb: string | null;
  supportType: SupportType;
  supportPlan: string | null;

  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
  emergencyContactPhone: string | null;

  assignedWorkerId: number | null;
  assignedWorkerName: string | null;

  nextVisitStart: string | null;
  nextVisitEnd: string | null;

  isActive: boolean;
  status: ClientStatus;
}

export interface ClientFormData {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  suburb: string;
  supportType: SupportType;
  supportPlan: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  isActive?: boolean;
}

interface RawClient {
  id?: number;

  fullName?: string;
  full_name?: string;

  phone?: string | null;

  dateOfBirth?: string | null;
  date_of_birth?: string | null;

  address?: string | null;
  suburb?: string | null;

  supportType?: SupportType;
  support_type?: SupportType;

  supportPlan?: string | null;
  support_plan?: string | null;

  emergencyContactName?: string | null;
  emergency_contact_name?: string | null;

  emergencyContactRelationship?: string | null;
  emergency_contact_relationship?: string | null;

  emergencyContactPhone?: string | null;
  emergency_contact_phone?: string | null;

  assignedWorkerId?: number | null;
  assigned_worker_id?: number | null;
  care_worker_id?: number | null;

  assignedWorkerName?: string | null;
  assigned_worker_name?: string | null;
  care_worker_name?: string | null;

  nextVisitStart?: string | null;
  next_visit_start?: string | null;
  shift_start?: string | null;

  nextVisitEnd?: string | null;
  next_visit_end?: string | null;
  shift_end?: string | null;

  isActive?: boolean;
  is_active?: boolean;
}

function getToken(): string {
  return localStorage.getItem("careflow_token") ?? "";
}

function normaliseClient(client: RawClient): Client {
  const isActive =
    client.isActive ??
    client.is_active ??
    true;

  return {
    id: Number(client.id),

    fullName:
      client.fullName ??
      client.full_name ??
      "Unknown client",

    phone: client.phone ?? null,

    dateOfBirth:
      client.dateOfBirth ??
      client.date_of_birth ??
      null,

    address: client.address ?? null,
    suburb: client.suburb ?? null,

    supportType:
      client.supportType ??
      client.support_type ??
      "Home care",

    supportPlan:
      client.supportPlan ??
      client.support_plan ??
      null,

    emergencyContactName:
      client.emergencyContactName ??
      client.emergency_contact_name ??
      null,

    emergencyContactRelationship:
      client.emergencyContactRelationship ??
      client.emergency_contact_relationship ??
      null,

    emergencyContactPhone:
      client.emergencyContactPhone ??
      client.emergency_contact_phone ??
      null,

    assignedWorkerId:
      client.assignedWorkerId ??
      client.assigned_worker_id ??
      client.care_worker_id ??
      null,

    assignedWorkerName:
      client.assignedWorkerName ??
      client.assigned_worker_name ??
      client.care_worker_name ??
      null,

    nextVisitStart:
      client.nextVisitStart ??
      client.next_visit_start ??
      client.shift_start ??
      null,

    nextVisitEnd:
      client.nextVisitEnd ??
      client.next_visit_end ??
      client.shift_end ??
      null,

    isActive,
    status: isActive ? "Active" : "Inactive",
  };
}

async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? "Unable to complete the request.",
    );
  }

  return data as T;
}

// GET /api/clients
export async function getClients(): Promise<Client[]> {
  const response = await request<
    RawClient[] | {
      clients?: RawClient[];
      data?: RawClient[];
    }
  >(`${API_URL}/clients`);

  const clients = Array.isArray(response)
    ? response
    : response.clients ?? response.data ?? [];

  return clients.map(normaliseClient);
}

// POST /api/clients
export async function createClient(
  clientData: ClientFormData,
): Promise<Client> {
  const response = await request<{
    client?: RawClient;
    data?: RawClient;
  }>(`${API_URL}/clients`, {
    method: "POST",
    body: JSON.stringify(clientData),
  });

  return normaliseClient(
    response.client ?? response.data ?? {},
  );
}

// PATCH /api/clients/:clientId
export async function updateClient(
  clientId: number,
  clientData: Partial<ClientFormData>,
): Promise<Client> {
  const response = await request<{
    client?: RawClient;
    data?: RawClient;
  }>(`${API_URL}/clients/${clientId}`, {
    method: "PATCH",
    body: JSON.stringify(clientData),
  });

  return normaliseClient(
    response.client ?? response.data ?? {},
  );
}

// POST /api/clients/:clientId/assign
export async function assignClient(
  clientId: number,
  careWorkerId: number,
): Promise<void> {
  await request(`${API_URL}/clients/${clientId}/assign`, {
    method: "POST",
    body: JSON.stringify({ careWorkerId }),
  });
}

// DELETE /api/clients/:clientId
export async function deleteClient(
  clientId: number,
): Promise<void> {
  await request(`${API_URL}/clients/${clientId}`, {
    method: "DELETE",
  });
}