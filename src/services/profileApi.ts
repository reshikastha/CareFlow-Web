import { getAuthToken } from "./authApi";

// Backend address from the Vite .env file.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/*
 * A compliance document returned by the backend.
 */
export type ComplianceDocument = {
  id: number;
  name: string;
  url: string;
  mimeType: string;
  verificationStatus:
    | "PENDING"
    | "VERIFIED"
    | "REJECTED";
  uploadedAt: string;
};

/*
 * Complete profile returned from GET /api/profile.
 */
export type UserProfile = {
  id: number;
  image: string | null;
  fullName: string;
  phone: string | null;

  // Email is displayed but not editable.
  email: string;

  address: string | null;

  emergencyContact: {
    name: string | null;
    phone: string | null;
  };

  employmentStatus:
    | "CASUAL"
    | "PART_TIME"
    | "FULL_TIME"
    | null;

  joinedDate: string | null;
  role: "ADMIN" | "CARE_WORKER";
  complianceDocuments: ComplianceDocument[];
};

/*
 * Fields users are allowed to update.
 *
 * Email, role, employment status and joined date
 * are not included because they are not editable.
 */
export type UpdateProfileData = {
  image?: File | null;
  fullName?: string;
  phone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
};

type ProfileResponse = {
  success: boolean;
  profile: UserProfile;
};

type UpdateProfileResponse = {
  success: boolean;
  message: string;
  profile?: UserProfile;
};

type ComplianceUploadResponse = {
  success: boolean;
  message: string;
  documents: ComplianceDocument[];
};

/*
 * Process the backend response and throw an error
 * when the request is unsuccessful.
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
 * Return the JWT token or throw an error
 * when the user is not logged in.
 */
function requireToken(): string {
  const token = getAuthToken();

  if (!token) {
    throw new Error("You must log in first.");
  }

  return token;
}

/*
 * GET PROFILE
 * GET http://localhost:5000/api/profile
 */
export async function getProfile(): Promise<UserProfile> {
  const token = requireToken();

  const response = await fetch(
    `${API_URL}/api/profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data =
    await handleResponse<ProfileResponse>(response);

  return data.profile;
}

/*
 * UPDATE PROFILE
 * PATCH http://localhost:5000/api/profile
 *
 * FormData is used because the request may include an image.
 */
export async function updateProfile(
  profileData: UpdateProfileData,
): Promise<UpdateProfileResponse> {
  const token = requireToken();

  const formData = new FormData();

  // Add the image only when the user selected one.
  if (profileData.image) {
    formData.append("image", profileData.image);
  }

  if (profileData.fullName !== undefined) {
    formData.append(
      "fullName",
      profileData.fullName,
    );
  }

  if (profileData.phone !== undefined) {
    formData.append("phone", profileData.phone);
  }

  if (profileData.address !== undefined) {
    formData.append(
      "address",
      profileData.address,
    );
  }

  if (
    profileData.emergencyContactName !== undefined
  ) {
    formData.append(
      "emergencyContactName",
      profileData.emergencyContactName,
    );
  }

  if (
    profileData.emergencyContactPhone !== undefined
  ) {
    formData.append(
      "emergencyContactPhone",
      profileData.emergencyContactPhone,
    );
  }

  const response = await fetch(
    `${API_URL}/api/profile`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,

        /*
         * Do not manually add Content-Type here.
         * The browser automatically creates the correct
         * multipart/form-data header and boundary.
         */
      },

      body: formData,
    },
  );

  return handleResponse<UpdateProfileResponse>(
    response,
  );
}

/*
 * UPLOAD COMPLIANCE DOCUMENTS
 * POST /api/profile/compliance-documents
 */
export async function uploadComplianceDocuments(
  files: File[],
): Promise<ComplianceUploadResponse> {
  const token = requireToken();

  if (files.length === 0) {
    throw new Error(
      "Please select at least one document.",
    );
  }

  const formData = new FormData();

  /*
   * Use the same field name, "documents", for every file.
   * This matches upload.array("documents", 10) in the backend.
   */
  files.forEach((file) => {
    formData.append("documents", file);
  });

  const response = await fetch(
    `${API_URL}/api/profile/compliance-documents`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  return handleResponse<ComplianceUploadResponse>(
    response,
  );
}