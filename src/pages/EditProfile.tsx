import {
  Camera,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  type ChangeEvent,
  type FormEvent,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

import "../styles/editProfile.css";

interface ProfileForm {
  firstName: string;
  lastName: string;
  preferredName: string;
  pronouns: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
}

const initialProfile: ProfileForm = {
  firstName: "Reshika",
  lastName: "Shrestha",
  preferredName: "Reshika",
  pronouns: "She / Her",
  phone: "+61 400 123 456",
  email: "reshika.shrestha@email.com",
  dateOfBirth: "2000-10-10",
  address: "12 Willow Crescent",
  suburb: "Adelaide",
  state: "South Australia",
  postcode: "5000",
  emergencyName: "Anita Shrestha",
  emergencyRelationship: "Sister",
  emergencyPhone: "+61 411 223 344",
};

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] =
    useState<ProfileForm>(initialProfile);

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");

  function handleInputChange(
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ): void {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("The image must be smaller than 5 MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
    setMessage("");
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): void {
    event.preventDefault();

    console.log("Updated profile:", formData);

    setMessage("Your profile has been updated successfully.");
  }

  function handleCancel(): void {
    navigate("/carer/profile");
  }

  return (
    <AppLayout>
      <main className="carer-page edit-profile-page">
        <div className="edit-profile-breadcrumb">
          <button
            type="button"
            onClick={() => navigate("/carer/profile")}
          >
            My profile
          </button>

          <span>/</span>
          <strong>Edit profile</strong>
        </div>

        <section className="edit-profile-heading">
          <div>
            <h1>Edit profile</h1>

            <p>
              Update your personal details and emergency contact
              information.
            </p>
          </div>
        </section>

        <form
          className="edit-profile-form"
          onSubmit={handleSubmit}
        >
          <section className="edit-profile-photo-card">
            <div className="edit-avatar-wrapper">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile preview"
                />
              ) : (
                <div className="edit-profile-avatar">RS</div>
              )}

              <button
                className="camera-button"
                type="button"
                aria-label="Change profile photo"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={17} />
              </button>
            </div>

            <div className="profile-photo-information">
              <h2>Profile photo</h2>

              <p>
                Upload a clear photo so clients and coordinators can
                recognise you.
              </p>

              <div className="profile-photo-actions">
                <button
                  className="upload-photo-button"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload new photo
                </button>

                {profileImage && (
                  <button
                    className="remove-photo-button"
                    type="button"
                    onClick={() => setProfileImage(null)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <small>JPG or PNG. Maximum file size 5 MB.</small>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                hidden
                onChange={handleImageChange}
              />
            </div>

            <span className="active-profile-status">
              Active
            </span>
          </section>

          <section className="edit-profile-grid">
            <article className="edit-profile-card">
              <header>
                <UserRound size={21} />

                <div>
                  <h2>Personal details</h2>
                  <p>Update your name and personal information.</p>
                </div>
              </header>

              <div className="edit-form-grid">
                <label>
                  First name <b>*</b>

                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Last name <b>*</b>

                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Preferred name

                  <input
                    name="preferredName"
                    type="text"
                    value={formData.preferredName}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Pronouns

                  <span className="edit-select-wrapper">
                    <select
                      name="pronouns"
                      value={formData.pronouns}
                      onChange={handleInputChange}
                    >
                      <option>She / Her</option>
                      <option>He / Him</option>
                      <option>They / Them</option>
                      <option>Prefer not to say</option>
                    </select>

                    <ChevronDown size={16} />
                  </span>
                </label>

                <label className="full-width-field">
                  Date of birth

                  <input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </article>

            <article className="edit-profile-card">
              <header>
                <Phone size={21} />

                <div>
                  <h2>Contact details</h2>
                  <p>
                    Update how CareFlow can contact you.
                  </p>
                </div>
              </header>

              <div className="edit-form-grid single-column">
                <label>
                  Phone number <b>*</b>

                  <span className="edit-icon-input">
                    <Phone size={17} />

                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </span>
                </label>

                <label>
                  Email address <b>*</b>

                  <span className="edit-icon-input">
                    <Mail size={17} />

                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </span>
                </label>

                <div className="email-information">
                  Your email address is also used for signing in and
                  important account notifications.
                </div>
              </div>
            </article>

            <article className="edit-profile-card">
              <header>
                <MapPin size={21} />

                <div>
                  <h2>Home address</h2>
                  <p>Update your residential address.</p>
                </div>
              </header>

              <div className="edit-form-grid">
                <label className="full-width-field">
                  Street address <b>*</b>

                  <input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Suburb <b>*</b>

                  <input
                    name="suburb"
                    type="text"
                    value={formData.suburb}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  State <b>*</b>

                  <span className="edit-select-wrapper">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    >
                      <option>South Australia</option>
                      <option>Victoria</option>
                      <option>New South Wales</option>
                      <option>Queensland</option>
                      <option>Western Australia</option>
                      <option>Tasmania</option>
                      <option>Australian Capital Territory</option>
                      <option>Northern Territory</option>
                    </select>

                    <ChevronDown size={16} />
                  </span>
                </label>

                <label>
                  Postcode <b>*</b>

                  <input
                    name="postcode"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={formData.postcode}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
            </article>

            <article className="edit-profile-card">
              <header>
                <UsersRound size={21} />

                <div>
                  <h2>Emergency contact</h2>

                  <p>
                    Who should we contact in an emergency?
                  </p>
                </div>
              </header>

              <div className="edit-form-grid single-column">
                <label>
                  Contact name <b>*</b>

                  <input
                    name="emergencyName"
                    type="text"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Relationship <b>*</b>

                  <input
                    name="emergencyRelationship"
                    type="text"
                    value={formData.emergencyRelationship}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Phone number <b>*</b>

                  <span className="edit-icon-input">
                    <Phone size={17} />

                    <input
                      name="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </span>
                </label>
              </div>
            </article>
          </section>

          {message && (
            <p
              className={
                message.includes("successfully")
                  ? "edit-profile-message success"
                  : "edit-profile-message error"
              }
              role="status"
            >
              {message}
            </p>
          )}

          <footer className="edit-profile-footer">
            <button
              className="cancel-profile-button"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              className="save-profile-button"
              type="submit"
            >
              Save changes
            </button>
          </footer>
        </form>
      </main>
    </AppLayout>
  );
}

export default EditProfile;