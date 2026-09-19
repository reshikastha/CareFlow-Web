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

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import "../styles/myProfile.css";

interface NotificationPreference {
  email: boolean;
  push: boolean;
}

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
  const [preferences, setPreferences] =
    useState<NotificationPreference>({
      email: true,
      push: true,
    });

  return (
    <AppLayout>
      <main className="carer-page profile-page">
        <section className="profile-heading">
          <div>
            <h1>My profile</h1>

            <p>
              View and manage your personal information, compliance
              and preferences.
            </p>
          </div>

          <button type="button">
            <Edit3 size={17} />
            Edit profile
          </button>
        </section>

        <section className="profile-summary-card">
          <div className="large-profile-avatar">RS</div>

          <div className="profile-summary-information">
            <div className="profile-name-row">
              <h2>Reshika Shrestha</h2>
              <span>Active</span>
            </div>

            <p>Care worker</p>

            <div className="profile-contact-row">
              <span>
                <Phone size={17} />
                +44 7700 900123
              </span>

              <span>
                <Mail size={17} />
                reshika.shrestha@email.com
              </span>

              <span>
                <MapPin size={17} />
                Leeds, West Yorkshire
              </span>
            </div>
          </div>
        </section>

        <nav className="profile-tabs">
          <button className="active" type="button">
            Personal details
          </button>

          <button type="button">Employment</button>
          <button type="button">Compliance</button>
          <button type="button">Preferences</button>
        </nav>

        <section className="profile-content-grid">
          <article className="profile-card personal-details-card">
            <h2>Personal details</h2>

            <dl>
              <div>
                <dt>Full name</dt>
                <dd>Reshika Shrestha</dd>
              </div>

              <div>
                <dt>Phone number</dt>
                <dd>+44 7700 900123</dd>
              </div>

              <div>
                <dt>Email address</dt>
                <dd>reshika.shrestha@email.com</dd>
              </div>

              <div>
                <dt>Home address</dt>
                <dd>
                  12 Willow Crescent
                  <br />
                  Leeds, LS6 3AB
                </dd>
              </div>
            </dl>
          </article>

          <article className="profile-card compliance-profile-card">
            <header>
              <h2>Compliance</h2>

              <button type="button">
                <Upload size={16} />
                Upload document
              </button>
            </header>

            <div className="profile-compliance-list">
              {complianceItems.map((item) => (
                <div
                  className="profile-compliance-row"
                  key={item.name}
                >
                  {item.status === "Current" ? (
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

                  <strong>{item.name}</strong>
                  <span>{item.expiry}</span>

                  <em
                    className={
                      item.status === "Current"
                        ? "compliance-current"
                        : "compliance-expiring"
                    }
                  >
                    {item.status}
                  </em>
                </div>
              ))}
            </div>
          </article>

          <article className="profile-card emergency-contact-card">
            <h2>Emergency contact</h2>

            <dl>
              <div>
                <dt>Name</dt>
                <dd>Anita Shrestha</dd>
              </div>

              <div>
                <dt>Relationship</dt>
                <dd>Sister</dd>
              </div>

              <div>
                <dt>Phone number</dt>
                <dd>+44 7711 223344</dd>
              </div>
            </dl>
          </article>

          <article className="profile-card notification-card">
            <h2>Notification preferences</h2>

            <p>
              Choose what you’d like to be notified about.
            </p>

            <div className="notification-preference">
              <Mail size={20} />

              <div>
                <strong>Email notifications</strong>
                <span>
                  Shift updates, messages and important alerts
                </span>
              </div>

              <label className="profile-toggle">
                <input
                  type="checkbox"
                  checked={preferences.email}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      email: event.target.checked,
                    }))
                  }
                />

                <span />
              </label>
            </div>

            <div className="notification-preference">
              <Bell size={20} />

              <div>
                <strong>Push notifications</strong>
                <span>Instant alerts on this device</span>
              </div>

              <label className="profile-toggle">
                <input
                  type="checkbox"
                  checked={preferences.push}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      push: event.target.checked,
                    }))
                  }
                />

                <span />
              </label>
            </div>
          </article>
        </section>
      </main>
    </AppLayout>
  );
}

export default MyProfile;