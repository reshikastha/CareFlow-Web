// Backend base address from the frontend .env file.
const API_URL = "http://localhost:5000";

/*
 * Information required by the registration endpoint.
 */
export type RegisterData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/*
 * Information required by the login endpoint.
 */
export type LoginData = {
  email: string;
  password: string;
};

/*
 * User returned after registration or login.
 */
export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "CARE_WORKER";
};

/*
 * Registration response from the backend.
 */
export type RegisterResponse = {
  success: boolean;
  message: string;
  user: AuthUser;
};

/*
 * Login response from the backend.
 */
export type LoginResponse = {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
};

/*
 * Read the backend response and throw an error
 * when the request was unsuccessful.
 */
async function handleResponse<T>(
  response: Response,
): Promise<T> {
  const data = await response.json().catch(() => ({
    message: "The server returned an invalid response.",
  }));

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong.",
    );
  }

  return data as T;
}

/*
 * REGISTER USER
 * POST http://localhost:5000/api/auth/register
 */
export async function registerUser(
  registrationData: RegisterData,
): Promise<RegisterResponse> {
  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: "POST",

      // Tell Express that we are sending JSON.
      headers: {
        "Content-Type": "application/json",
      },

      // Convert the JavaScript object into JSON.
      body: JSON.stringify(registrationData),
    },
  );

  return handleResponse<RegisterResponse>(response);
}

/*
 * LOGIN USER
 * POST http://localhost:5000/api/auth/login
 */
export async function loginUser(
  loginData: LoginData,
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(loginData),
    },
  );

  const data =
    await handleResponse<LoginResponse>(response);

    console.log("Login response:", data);
  console.log("Logged-in user:", data.user);
  console.log("User ID:", data.user.id);
  console.log("User role:", data.user.role);

  localStorage.setItem(
    "careflow_token",
    data.token,
  );


  // Save non-sensitive user information.
  localStorage.setItem(
    "careflow_user",
    JSON.stringify(data.user),
  );

  return data;
}

/*
 * Return the saved login token.
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("careflow_token");
}

/*
 * Return the saved logged-in user.
 */


export function getStoredUser(): AuthUser | null {
  const savedUser = localStorage.getItem("careflow_user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as AuthUser;
  } catch {
    localStorage.removeItem("careflow_user");
    return null;
  }
}

/*
 * Log out by removing authentication data.
 */
export function logoutUser(): void {
  localStorage.removeItem("careflow_token");
  localStorage.removeItem("careflow_user");
}

/*
 * Helper for calling protected backend endpoints.
 *
 * Example:
 * authenticatedFetch("/api/profile")
 */
export async function authenticatedFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("You must log in first.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  return handleResponse<T>(response);
}