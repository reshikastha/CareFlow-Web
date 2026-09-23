import {
  Bell,
  CheckCircle2,
  Edit3,
  Mail,
  MapPin,
  Phone,
  TriangleAlert,
  Upload,
} from "lucide-react";

import {
    useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import AppLayout from "../components/AppLayout";
import "../styles/myProfile.css";

import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  uploadComplianceDocuments,
  type UserProfile,
} from "../services/profileApi";

type ProfileTab =
  | "personal"
  | "employment"
  | "compliance"
  | "preferences";

const complianceItems = [
  {
    name: "First aid",
    expiry: "Valid until 14 Mar 2026",
    status: "Current",
  },
  {
    name: "CPR",
    expiry: "Valid until 22 Jan 2026",
    status: "Current",
  },
  {
    name: "Manual handling",
    expiry: "Valid until 10 Sep 2025",
    status: "Expiring soon",
  },
  {
    name: "Worker screening",
    expiry: "Valid until 5 Feb 2027",
    status: "Current",
  },
];

function MyProfile() {

 const navigate = useNavigate();

  // Used to open the hidden document input.
  const documentInputRef =
    useRef<HTMLInputElement>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [activeTab, setActiveTab] =
    useState<ProfileTab>("personal");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /*
   * Load the current user's profile from:
   * GET /api/profile
   */
  const loadProfile = useCallback(async () => {
    try {
      setError("");

      const profileData = await getProfile();

      setProfile(profileData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your profile.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /*
   * Open the computer's file selector when the
   * Upload document button is selected.
   */
  const openDocumentSelector = () => {
    documentInputRef.current?.click();
  };

  /*
   * Upload selected compliance documents using:
   * POST /api/profile/compliance-documents
   */
  const handleDocumentUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files || [],
    );

    if (files.length === 0) {
      return;
    }

    try {
      setIsUploading(true);
      setError("");
      setMessage("");

      const response =
        await uploadComplianceDocuments(files);

      setMessage(response.message);

      // Reload the profile to show the uploaded documents.
      await loadProfile();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload documents.",
      );
    } finally {
      setIsUploading(false);

      // Reset the input so the same file can be selected again.
      event.target.value = "";
    }
  };

  /*
   * Create profile initials when no image exists.
   *
   * Example:
   * Reshika Shrestha becomes RS.
   */
  const getInitials = (fullName: any) => {
    return fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name: any) => name.charAt(0).toUpperCase())
      .join("");
  };

  /*
   * Convert values such as PART_TIME into Part Time.
   */
  const formatValue = (
    value: string | null | undefined,
  ) => {
    if (!value) {
      return "Not provided";
    }

    return value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  };

  const formatDate = (
    value: string | null | undefined,
  ) => {
    if (!value) {
      return "Not provided";
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString(
      "en-AU",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <main className="carer-page profile-page">
          <p>Loading profile...</p>
        </main>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <main className="carer-page profile-page">
          <p className="error-message">
            {error || "Profile not found."}
          </p>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="carer-page profile-page">
        <section className="profile-heading">
          <div>
            <h1>My profile</h1>
          {error && <p className="error-message">{error}</p>}

              {message && (
                <p className="success-message">{message}</p>
              )}
            <p>
              View and manage your personal information, compliance
              and preferences.
            </p>
          </div>

          <button type="button" onClick={() => navigate("/carer/profile/edit")}>
            <Edit3 size={17} />
            Edit profile
          </button>
        </section>

        <section className="profile-summary-card">
          {profile.image ? (
                  <img
                    className="large-profile-avatar profile-image"
                    src={profile.image}
                    alt={profile.fullName}
                  />
                ) : (
                  <div className="large-profile-avatar">
                    {getInitials(profile.fullName)}
                  </div>
                )}

          <div className="profile-summary-information">
            <div className="profile-name-row">
              <h2>{profile.fullName}</h2>
              <span>Active</span>
            </div>

            <p>{formatValue(profile.role)}</p>

            <div className="profile-contact-row">
              <span>
                <Phone size={17} />
             {profile.phone || "Not provided"}
              </span>

              <span>
                <Mail size={17} />
                 {profile.email}
              </span>

              <span>
                <MapPin size={17} />
                 {profile.address || "Not provided"}
              </span>
            </div>
          </div>
        </section>

        <nav className="profile-tabs">
          <button  className={
              activeTab === "personal" ? "active" : ""
            }
            type="button"
            onClick={() => setActiveTab("personal")}>
            Personal details
          </button>

         <button
            className={
              activeTab === "employment" ? "active" : ""
            }
            type="button"
            onClick={() => setActiveTab("employment")}
          >
            Employment
          </button>

          <button
            className={
              activeTab === "compliance" ? "active" : ""
            }
            type="button"
            onClick={() => setActiveTab("compliance")}
          >
            Compliance
          </button>

          <button
            className={
              activeTab === "preferences" ? "active" : ""
            }
            type="button"
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
        </nav>

        <section className="profile-content-grid">
           {activeTab === "personal" && (
            <>
              <article className="profile-card personal-details-card">
                <h2>Personal details</h2>

                <dl>
                  <div>
                    <dt>Full name</dt>
                    <dd>{profile.fullName}</dd>
                  </div>

                  <div>
                    <dt>Phone number</dt>
                    <dd>
                      {profile.phone || "Not provided"}
                    </dd>
                  </div>

                  <div>
                    <dt>Email address</dt>
                    <dd>{profile.email}</dd>
                  </div>

                  <div>
                    <dt>Home address</dt>
                    <dd>
                      {profile.address ||
                        "Not provided"}
                    </dd>
                  </div>
                </dl>
              </article>

              <article className="profile-card emergency-contact-card">
                <h2>Emergency contact</h2>

                <dl>
                  <div>
                    <dt>Name</dt>
                    <dd>
                      {profile.emergencyContact.name ||
                        "Not provided"}
                    </dd>
                  </div>

                  <div>
                    <dt>Phone number</dt>
                    <dd>
                      {profile.emergencyContact.phone ||
                        "Not provided"}
                    </dd>
                  </div>
                </dl>
              </article>
            </>
          )}



          {activeTab === "employment" && (
            <article className="profile-card employment-profile-card">
              <h2>Employment details</h2>

              <dl>
                <div>
                  <dt>Role</dt>
                  <dd>{formatValue(profile.role)}</dd>
                </div>

                <div>
                  <dt>Employment status</dt>
                  <dd>
                    {formatValue(
                      profile.employmentStatus,
                    )}
                  </dd>
                </div>

                <div>
                  <dt>Joined date</dt>
                  <dd>
                    {formatDate(profile.joinedDate)}
                  </dd>
                </div>
              </dl>
            </article>
          )}

          {activeTab === "compliance" && (
            <article className="profile-card compliance-profile-card">
              <header>
                <h2>Compliance</h2>

                <button
                  type="button"
                  onClick={openDocumentSelector}
                  disabled={isUploading}
                >
                  <Upload size={16} />

                  {isUploading
                    ? "Uploading..."
                    : "Upload document"}
                </button>

                {/* Hidden file input opened by the button */}
                <input
                  ref={documentInputRef}
                  type="file"
                  multiple
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                />
              </header>

              <div className="profile-compliance-list">
                {profile.complianceDocuments.length ===
                0 ? (
                  <p style={{padding:'20px'}}>
                    No compliance documents uploaded.
                  </p>
                ) : (
                  profile.complianceDocuments.map(
                    (document) => {
                      const isVerified =
                        document.verificationStatus ===
                        "VERIFIED";

                      return (
                        <div
                          className="profile-compliance-row"
                          key={document.id}
                        >
                          {isVerified ? (
                            <CheckCircle2
                              className="current-icon"
                              size={19}
                            />
                          ) : (
                            <TriangleAlert
                              className="expiring-icon"
                              size={19}
                            />
                          )}

                          <a
                            href={document.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <strong>
                              {document.name}
                            </strong>
                          </a>

                          <span>
                            Uploaded{" "}
                            {new Date(
                              document.uploadedAt,
                            ).toLocaleDateString(
                              "en-AU",
                            )}
                          </span>

                          <em
                            className={
                              isVerified
                                ? "compliance-current"
                                : "compliance-expiring"
                            }
                          >
                            {formatValue(
                              document.verificationStatus,
                            )}
                          </em>
                        </div>
                      );
                    },
                  )
                )}
              </div>
            </article>
          )}

     

        </section>
      </main>
    </AppLayout>
  );
}

export default MyProfile;