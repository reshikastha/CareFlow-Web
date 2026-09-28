const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export type Availability =
  | "Available"
  | "On shift"
  | "Unavailable";

export type Compliance =
  | "Compliant"
  | "Expiring soon"
  | "Non-compliant";

export type EmploymentStatus =
  | "CASUAL"
  | "PART_TIME"
  | "FULL_TIME";

export interface Worker {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  address: string | null;
  profileImage: string | null;
  employmentStatus: EmploymentStatus | null;
  joinedDate: string | null;
  isActive: boolean;
  availability: Availability;
  hoursThisWeek: number;
  compliance: Compliance;
}

export interface CreateWorkerData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  employmentStatus: EmploymentStatus;
  joinedDate: string;
}

export interface UpdateWorkerData {
  fullName?: string;
  phone?: string;
  address?: string;
  employmentStatus?: EmploymentStatus;
  joinedDate?: string;
  isActive?: boolean;
  availability?: Availability;
}

interface RawWorker {
  id?: number;

  fullName?: string;
  full_name?: string;

  email?: string;
  phone?: string | null;
  role?: string;
  address?: string | null;

  profileImage?: string | null;
  profile_image?: string | null;

  employmentStatus?: EmploymentStatus | null;
  employment_status?: EmploymentStatus | null;

  joinedDate?: string | null;
  joined_date?: string | null;

  isActive?: boolean;
  is_active?: boolean;

  availability?: Availability;

  hoursThisWeek?: number;
  hours_this_week?: number;

  compliance?: Compliance;
  compliance_status?: Compliance;
}

function getToken(): string {
  return localStorage.getItem("careflow_token") ?? "";
}

function normaliseWorker(worker: RawWorker): Worker {
  return {
    id: Number(worker.id),

    fullName:
      worker.fullName ??
      worker.full_name ??
      "Unknown worker",

    email: worker.email ?? "",
    phone: worker.phone ?? null,
    role: worker.role ?? "CARE_WORKER",
    address: worker.address ?? null,

    profileImage:
      worker.profileImage ??
      worker.profile_image ??
      null,

    employmentStatus:
      worker.employmentStatus ??
      worker.employment_status ??
      null,

    joinedDate:
      worker.joinedDate ??
      worker.joined_date ??
      null,

    isActive:
      worker.isActive ??
      worker.is_active ??
      true,

    availability:
      worker.availability ??
      ((worker.isActive ?? worker.is_active ?? true)
        ? "Available"
        : "Unavailable"),

    hoursThisWeek:
      worker.hoursThisWeek ??
      worker.hours_this_week ??
      0,

    compliance:
      worker.compliance ??
      worker.compliance_status ??
      "Compliant",
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

  return data;
}

// GET /api/workers
export async function getWorkers(): Promise<Worker[]> {
  const response = await request<{
    workers?: RawWorker[];
    data?: RawWorker[];
  } | RawWorker[]>(`${API_URL}/workers`);

  const workers = Array.isArray(response)
    ? response
    : response.workers ?? response.data ?? [];

  return workers.map(normaliseWorker);
}

// GET /api/workers/:workerId
export async function getWorker(
  workerId: number,
): Promise<Worker> {
  const response = await request<{
    worker?: RawWorker;
    data?: RawWorker;
  } | RawWorker>(`${API_URL}/workers/${workerId}`);

  const worker =
    "worker" in response && response.worker
      ? response.worker
      : "data" in response && response.data
        ? response.data
        : response;

  return normaliseWorker(worker as RawWorker);
}

// POST /api/workers
export async function createWorker(
  workerData: CreateWorkerData,
): Promise<Worker> {
  const response = await request<{
    worker?: RawWorker;
    data?: RawWorker;
  }>(`${API_URL}/workers`, {
    method: "POST",
    body: JSON.stringify(workerData),
  });

  return normaliseWorker(
    response.worker ?? response.data ?? {},
  );
}

// PATCH /api/workers/:workerId
export async function updateWorker(
  workerId: number,
  workerData: UpdateWorkerData,
): Promise<Worker> {
  const response = await request<{
    worker?: RawWorker;
    data?: RawWorker;
  }>(`${API_URL}/workers/${workerId}`, {
    method: "PATCH",
    body: JSON.stringify(workerData),
  });

  return normaliseWorker(
    response.worker ?? response.data ?? {},
  );
}