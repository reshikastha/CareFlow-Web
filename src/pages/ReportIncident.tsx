import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Paperclip,
  TriangleAlert,
} from "lucide-react";

import {
  type FormEvent,
  useState,
} from "react";

import AppLayout from "../components/AppLayout";
import "../styles/reportIncident.css";

interface IncidentFormData {
  incidentDate: string;
  incidentTime: string;
  client: string;
  shift: string;
  location: string;
  incidentType: string;
  severity: string;
  injuryStatus: string;
  peopleNotified: string;
  confirmed: boolean;
}

const initialForm: IncidentFormData = {
  incidentDate: "2025-07-24",
  incidentTime: "10:15",
  client: "Jordan Davis",
  shift: "Tue, 24 Jul 2025 (9:00 am – 1:00 pm)",
  location: "Client's home",
  incidentType: "Fall",
  severity: "Moderate",
  injuryStatus: "No visible injury",
  peopleNotified: "Supervisor, Client's family",
  confirmed: true,
};

function ReportIncident() {
  const [formData, setFormData] =
    useState<IncidentFormData>(initialForm);

  const [message, setMessage] = useState("");

  function updateField(
    field: keyof IncidentFormData,
    value: string | boolean
  ): void {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): void {
    event.preventDefault();

    setMessage(
      "Incident details saved. You can now continue to the description."
    );
  }

  return (
    <AppLayout>
      <main className="carer-page report-incident-page">
        <section className="report-incident-heading">
          <h1>Report an incident</h1>

          <p>
            Let us know what happened. Your report helps us keep
            everyone safe and supported.
          </p>
        </section>

        <section className="emergency-warning">
          <TriangleAlert size={22} />

          <p>
            <strong>
              In an emergency, call 000 immediately
            </strong>

            <span>
              If someone is in immediate danger or needs urgent
              medical attention, contact emergency services first,
              then complete this report.
            </span>
          </p>
        </section>

        <section className="incident-progress">
          <div className="active">
            <span>1</span>
            <strong>Details</strong>
          </div>

          <div>
            <span>2</span>
            <strong>Description</strong>
          </div>

          <div>
            <span>3</span>
            <strong>Review</strong>
          </div>
        </section>

        <form
          className="report-incident-form"
          onSubmit={handleSubmit}
        >
          <header>
            <h2>Incident details</h2>

            <p>
              Provide the key information about what happened.
            </p>
          </header>

          <div className="incident-form-grid">
            <label>
              Incident date <b>*</b>

              <span className="incident-input-icon">
                <CalendarDays size={17} />

                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(event) =>
                    updateField(
                      "incidentDate",
                      event.target.value
                    )
                  }
                  required
                />
              </span>
            </label>

            <label>
              Incident time <b>*</b>

              <span className="incident-input-icon">
                <Clock3 size={17} />

                <input
                  type="time"
                  value={formData.incidentTime}
                  onChange={(event) =>
                    updateField(
                      "incidentTime",
                      event.target.value
                    )
                  }
                  required
                />
              </span>
            </label>

            <label>
              Client <b>*</b>

              <span className="incident-select">
                <select
                  value={formData.client}
                  onChange={(event) =>
                    updateField("client", event.target.value)
                  }
                  required
                >
                  <option>Jordan Davis</option>
                  <option>Margaret Lewis</option>
                  <option>Brian Chen</option>
                  <option>Claire Campbell</option>
                </select>

                <ChevronDown size={16} />
              </span>
            </label>

            <label>
              Shift <b>*</b>

              <span className="incident-select">
                <select
                  value={formData.shift}
                  onChange={(event) =>
                    updateField("shift", event.target.value)
                  }
                >
                  <option>
                    Tue, 24 Jul 2025 (9:00 am – 1:00 pm)
                  </option>
                </select>

                <ChevronDown size={16} />
              </span>
            </label>

            <label>
              Location <b>*</b>

              <span className="incident-select">
                <select
                  value={formData.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                >
                  <option>Client's home</option>
                  <option>Community location</option>
                  <option>Vehicle</option>
                  <option>Care facility</option>
                </select>

                <ChevronDown size={16} />
              </span>
            </label>

            <label>
              Incident type <b>*</b>

              <span className="incident-select">
                <select
                  value={formData.incidentType}
                  onChange={(event) =>
                    updateField(
                      "incidentType",
                      event.target.value
                    )
                  }
                >
                  <option>Fall</option>
                  <option>Medication</option>
                  <option>Behavioural</option>
                  <option>Client unwell</option>
                  <option>Environmental</option>
                </select>

                <ChevronDown size={16} />
              </span>
            </label>

            <label>
              Severity <b>*</b>

              <span className="incident-select">
                <select
                  value={formData.severity}
                  onChange={(event) =>
                    updateField("severity", event.target.value)
                  }
                >
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>

                <ChevronDown size={16} />
              </span>
            </label>

            <label>
              Injury status <b>*</b>

              <span className="incident-select">
                <select
                  value={formData.injuryStatus}
                  onChange={(event) =>
                    updateField(
                      "injuryStatus",
                      event.target.value
                    )
                  }
                >
                  <option>No visible injury</option>
                  <option>Minor injury</option>
                  <option>Medical attention required</option>
                  <option>Emergency services contacted</option>
                </select>

                <ChevronDown size={16} />
              </span>
            </label>

            <label>
              People notified <b>*</b>

              <input
                type="text"
                value={formData.peopleNotified}
                onChange={(event) =>
                  updateField(
                    "peopleNotified",
                    event.target.value
                  )
                }
              />
            </label>

            <div>
              <span className="attachment-title">
                Attachments (optional)
              </span>

              <label className="incident-file-upload">
                <Paperclip size={22} />

                <span>
                  <strong>
                    Choose a file or drag and drop
                  </strong>

                  <small>
                    PDF, JPG or PNG (max 5 MB)
                  </small>
                </span>

                <input type="file" hidden />
              </label>
            </div>
          </div>

          <label className="incident-confirmation">
            <input
              type="checkbox"
              checked={formData.confirmed}
              onChange={(event) =>
                updateField("confirmed", event.target.checked)
              }
              required
            />

            <span>
              I confirm that the information provided is accurate to
              the best of my knowledge.
            </span>
          </label>

          {message && (
            <p className="incident-form-message">
              <Check size={16} />
              {message}
            </p>
          )}

          <footer>
            <button type="button">Save draft</button>

            <button type="submit">
              Review report
            </button>
          </footer>
        </form>
      </main>
    </AppLayout>
  );
}

export default ReportIncident;